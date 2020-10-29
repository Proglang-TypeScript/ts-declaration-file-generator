import {
  DTSType,
  DTSTypeKinds,
  DTSTypeKeyword,
  DTSTypeKeywords,
  DTSTypeLiteralType,
} from '../types';
import ts from 'typescript';

export const createTypeNode = (type: DTSType): ts.TypeNode => {
  switch (type.kind) {
    case DTSTypeKinds.KEYWORD:
      return createKeywordType(type);

    case DTSTypeKinds.LITERAL_TYPE:
      return createLiteralType(type);

    case DTSTypeKinds.UNION:
      return ts.createUnionTypeNode(type.value.map((v) => createTypeNode(v)));
  }
};

const createKeywordType = (type: DTSTypeKeyword): ts.KeywordTypeNode => {
  type SupportedKeywords =
    | ts.SyntaxKind.VoidKeyword
    | ts.SyntaxKind.StringKeyword
    | ts.SyntaxKind.NumberKeyword
    | ts.SyntaxKind.AnyKeyword
    | ts.SyntaxKind.UnknownKeyword;

  const mapTypeScriptNodes: { [k in DTSTypeKeywords]: SupportedKeywords } = {
    [DTSTypeKeywords.VOID]: ts.SyntaxKind.VoidKeyword,
    [DTSTypeKeywords.STRING]: ts.SyntaxKind.StringKeyword,
    [DTSTypeKeywords.NUMBER]: ts.SyntaxKind.NumberKeyword,
    [DTSTypeKeywords.ANY]: ts.SyntaxKind.AnyKeyword,
    [DTSTypeKeywords.UNKNOWN]: ts.SyntaxKind.UnknownKeyword,
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
