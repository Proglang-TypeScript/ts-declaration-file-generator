import ts from 'typescript';
import { DTS, DTSFunction, DTSFunctionModifiers } from './types';

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
      ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      undefined,
    ),
  ) as unknown) as ts.NodeArray<ts.Statement>;

  return ast;
};

const createModifiers = (f: DTSFunction): ts.Modifier[] => {
  return f.modifiers?.map((modifier) => {
    switch (modifier) {
      case DTSFunctionModifiers.EXPORT:
        return ts.createModifier(ts.SyntaxKind.ExportKeyword);
        break;
    }
  });
};
