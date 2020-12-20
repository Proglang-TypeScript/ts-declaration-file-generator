import {
  DTSType,
  DTSTypeKinds,
  DTSTypeKeyword,
  DTSTypeKeywords,
  DTSTypeLiteralType,
  DTSTypeReference,
  DTS,
  DTSTypeInterface,
} from '../types';
import ts from 'typescript';

export const createTypeNode = (type: DTSType, context?: DTS): ts.TypeNode => {
  switch (type.kind) {
    case DTSTypeKinds.KEYWORD:
      return createKeywordType(type);

    case DTSTypeKinds.LITERAL_TYPE:
      return createLiteralType(type);

    case DTSTypeKinds.UNION:
      return ts.createUnionTypeNode(type.value.map((v) => createTypeNode(v, context)));

    case DTSTypeKinds.TYPE_REFERENCE:
      return createReferenceType(type);

    case DTSTypeKinds.INTERFACE:
      return createInterfaceType(type, context);

    case DTSTypeKinds.ARRAY:
      return ts.createArrayTypeNode(createTypeNode(type.value, context));

    default:
      return createKeywordType({
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.UNKNOWN,
      });
  }
};

const createKeywordType = (type: DTSTypeKeyword): ts.KeywordTypeNode => {
  type SupportedKeywords =
    | ts.SyntaxKind.VoidKeyword
    | ts.SyntaxKind.StringKeyword
    | ts.SyntaxKind.NumberKeyword
    | ts.SyntaxKind.AnyKeyword
    | ts.SyntaxKind.UnknownKeyword
    | ts.SyntaxKind.BooleanKeyword
    | ts.SyntaxKind.UndefinedKeyword
    | ts.SyntaxKind.NullKeyword
    | ts.SyntaxKind.ObjectKeyword;

  const mapTypeScriptNodes: { [k in DTSTypeKeywords]: SupportedKeywords } = {
    [DTSTypeKeywords.VOID]: ts.SyntaxKind.VoidKeyword,
    [DTSTypeKeywords.STRING]: ts.SyntaxKind.StringKeyword,
    [DTSTypeKeywords.NUMBER]: ts.SyntaxKind.NumberKeyword,
    [DTSTypeKeywords.ANY]: ts.SyntaxKind.AnyKeyword,
    [DTSTypeKeywords.UNKNOWN]: ts.SyntaxKind.UnknownKeyword,
    [DTSTypeKeywords.BOOLEAN]: ts.SyntaxKind.BooleanKeyword,
    [DTSTypeKeywords.UNDEFINED]: ts.SyntaxKind.UndefinedKeyword,
    [DTSTypeKeywords.NULL]: ts.SyntaxKind.NullKeyword,
    [DTSTypeKeywords.OBJECT]: ts.SyntaxKind.ObjectKeyword,
  };

  return ts.createKeywordTypeNode(mapTypeScriptNodes[type.value]);
};

const createLiteralType = (type: DTSTypeLiteralType): ts.LiteralTypeNode => {
  switch (typeof type.value) {
    case 'string':
      return ts.createLiteralTypeNode(ts.createStringLiteral(type.value));

    case 'number':
      return ts.createLiteralTypeNode(ts.createNumericLiteral(`${type.value}`));

    case 'boolean':
      return type.value === true
        ? ts.createLiteralTypeNode(ts.createTrue())
        : ts.createLiteralTypeNode(ts.createFalse());
  }
};

const createInterfaceType = (type: DTSTypeInterface, context?: DTS): ts.TypeReferenceNode => {
  const interfacesInNamespace = context?.namespace?.interfaces || [];

  let typeReferenceValue: string | ts.QualifiedName = type.value;
  if (
    interfacesInNamespace.length > 0 &&
    interfacesInNamespace.some((i) => i.name === type.value)
  ) {
    typeReferenceValue = ts.createQualifiedName(
      ts.createIdentifier(context?.namespace?.name || ''),
      type.value,
    );
  }

  return ts.createTypeReferenceNode(typeReferenceValue, undefined);
};

const createReferenceType = (type: DTSTypeReference): ts.TypeReferenceNode => {
  return ts.createTypeReferenceNode(type.value, undefined);
};
