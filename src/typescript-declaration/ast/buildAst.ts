import ts from 'typescript';
import {
  DTS,
  DTSFunction,
  DTSFunctionModifiers,
  DTSTypeKinds,
  DTSType,
  DTSTypeKeyword,
  DTSKeywords,
} from './types';

export const buildAst = (declarationFile: DTS): ts.Node => {
  const ast = ts.createSourceFile(
    'module-ast.d.ts',
    '',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  ast.statements = (declarationFile.functions?.map((f) =>
    ts.createFunctionDeclaration(
      undefined,
      createModifiers(f),
      undefined,
      ts.createIdentifier(f.name),
      undefined,
      [],
      createReturnType(f),
      undefined,
    ),
  ) as unknown) as ts.NodeArray<ts.Statement>;

  return ast;
};

const createModifiers = (f: DTSFunction): ts.Modifier[] => {
  return (
    f.modifiers?.map((modifier) => {
      switch (modifier) {
        case DTSFunctionModifiers.EXPORT:
          return ts.createModifier(ts.SyntaxKind.ExportKeyword);
      }
    }) || []
  );
};

const createReturnType = (f: DTSFunction): ts.TypeNode | undefined => {
  if (f.returnType === undefined) {
    return undefined;
  }

  switch (f.returnType.kind) {
    case DTSTypeKinds.KEYWORD:
      return createKeywordType(f.returnType);
  }

  return ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
};

const createKeywordType = (type: DTSTypeKeyword): ts.KeywordTypeNode | undefined => {
  const mapTypeScriptNodes = {
    [DTSKeywords.VOID]: ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    [DTSKeywords.STRING]: ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    [DTSKeywords.NUMBER]: ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    [DTSKeywords.ANY]: ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
    [DTSKeywords.UNKNOWN]: ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
  };

  return mapTypeScriptNodes[type.value];
};
