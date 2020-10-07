import ts from 'typescript';

export function emitAST(node: ts.Node): string {
  const resultFile = ts.createSourceFile(
    '',
    '',
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
}

export function createASTFromFile(file: string): ts.Node {
  return (
    ts.createProgram([file], {}).getSourceFile(file) || ts.createNode(ts.SyntaxKind.EmptyStatement)
  );
}

export function createAST(content: string): ts.Node {
  return ts.createSourceFile(
    'content.d.ts',
    content,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS,
  );
}
