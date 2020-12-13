import ts from 'typescript';

export function emit(node: ts.Node): string {
  const resultFile = ts.createSourceFile(
    '',
    '',
    ts.ScriptTarget.ES2020,
    /*setParentNodes*/ true,
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

export function createFromString(content: string): ts.Node {
  return ts.createSourceFile(
    'create-from-string.ts',
    content,
    ts.ScriptTarget.ES2020,
    /*setParentNodes*/ true,
    ts.ScriptKind.TS,
  );
}
