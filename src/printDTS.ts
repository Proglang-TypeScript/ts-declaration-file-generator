import ts from 'typescript';

const resultFile = ts.createSourceFile(
  'declarationFile.d.ts',
  '',
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ false,
  ts.ScriptKind.TS,
);

const declarationFile = ts.createFunctionDeclaration(
  undefined,
  [ts.createToken(ts.SyntaxKind.ExportKeyword)],
  undefined,
  'foo',
  undefined,
  [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      'a',
      undefined,
      ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    ),
  ],
  ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  undefined,
);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const result = printer.printNode(ts.EmitHint.Unspecified, declarationFile, resultFile);
// eslint-disable-next-line no-console
console.log(result);
