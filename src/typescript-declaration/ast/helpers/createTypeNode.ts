import {
  DTSType,
  DTSTypeKinds,
  DTSTypeKeyword,
  DTSTypeKeywords,
  DTSTypeLiteralType,
  DTSTypeReference,
  DTS,
  DTSTypeInterface,
  DTSTypeFunction,
} from '../types';
import ts from 'typescript';
import { createParameter } from './createParameter';

export const createTypeNode = (type: DTSType, context?: DTS): ts.TypeNode => {
  switch (type.kind) {
    case DTSTypeKinds.KEYWORD:
      return createKeywordType(type);

    case DTSTypeKinds.LITERAL_TYPE:
      return createLiteralType(type);

    case DTSTypeKinds.UNION:
      return ts.factory.createUnionTypeNode(type.value.map((v) => createTypeNode(v, context)));

    case DTSTypeKinds.TYPE_REFERENCE:
      return createReferenceType(type);

    case DTSTypeKinds.INTERFACE:
      return createInterfaceType(type, context);

    case DTSTypeKinds.ARRAY:
      return ts.factory.createArrayTypeNode(createTypeNode(type.value, context));

    case DTSTypeKinds.FUNCTION:
      return createFunctionType(type);

    default:
      return createKeywordType({
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.UNKNOWN,
      });
  }
};

const createKeywordType = (type: DTSTypeKeyword): ts.TypeNode => {
  if (type.value === DTSTypeKeywords.NULL)
    return ts.factory.createLiteralTypeNode(ts.factory.createNull());
  type SupportedKeywords =
    | ts.SyntaxKind.VoidKeyword
    | ts.SyntaxKind.StringKeyword
    | ts.SyntaxKind.NumberKeyword
    | ts.SyntaxKind.AnyKeyword
    | ts.SyntaxKind.UnknownKeyword
    | ts.SyntaxKind.BooleanKeyword
    | ts.SyntaxKind.UndefinedKeyword
    | ts.SyntaxKind.ObjectKeyword;

  const mapTypeScriptNodes: {
    [k in Exclude<DTSTypeKeywords, DTSTypeKeywords.NULL>]: SupportedKeywords;
  } = {
    [DTSTypeKeywords.VOID]: ts.SyntaxKind.VoidKeyword,
    [DTSTypeKeywords.STRING]: ts.SyntaxKind.StringKeyword,
    [DTSTypeKeywords.NUMBER]: ts.SyntaxKind.NumberKeyword,
    [DTSTypeKeywords.ANY]: ts.SyntaxKind.AnyKeyword,
    [DTSTypeKeywords.UNKNOWN]: ts.SyntaxKind.UnknownKeyword,
    [DTSTypeKeywords.BOOLEAN]: ts.SyntaxKind.BooleanKeyword,
    [DTSTypeKeywords.UNDEFINED]: ts.SyntaxKind.UndefinedKeyword,
    [DTSTypeKeywords.OBJECT]: ts.SyntaxKind.ObjectKeyword,
  };

  return ts.factory.createKeywordTypeNode(mapTypeScriptNodes[type.value]);
};

const createLiteralType = (type: DTSTypeLiteralType): ts.LiteralTypeNode => {
  switch (typeof type.value) {
    case 'string':
      return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(type.value));

    case 'number':
      return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(`${type.value}`));

    case 'boolean':
      return type.value === true
        ? ts.factory.createLiteralTypeNode(ts.factory.createTrue())
        : ts.factory.createLiteralTypeNode(ts.factory.createFalse());
  }
};

const createInterfaceType = (type: DTSTypeInterface, context?: DTS): ts.TypeReferenceNode => {
  const interfacesInNamespace = context?.namespace?.interfaces || [];

  let typeReferenceValue: string | ts.QualifiedName = type.value;
  if (
    interfacesInNamespace.length > 0 &&
    interfacesInNamespace.some((i) => i.name === type.value)
  ) {
    typeReferenceValue = ts.factory.createQualifiedName(
      ts.factory.createIdentifier(context?.namespace?.name || ''),
      type.value,
    );
  }

  return ts.factory.createTypeReferenceNode(typeReferenceValue, undefined);
};

const createReferenceType = (type: DTSTypeReference): ts.TypeReferenceNode => {
  return ts.factory.createTypeReferenceNode(type.value, undefined);
};

const createFunctionType = (type: DTSTypeFunction): ts.FunctionTypeNode => {
  const dtsFunction = type.value;
  return ts.factory.createFunctionTypeNode(
    undefined,
    dtsFunction.parameters?.map((p) => createParameter(p)) || [],
    dtsFunction.returnType
      ? createTypeNode(dtsFunction.returnType)
      : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
  );
};
