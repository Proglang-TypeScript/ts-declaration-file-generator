import ts from 'typescript';
import { DTS } from './types';
import { createStatements } from './helpers/createStatements';

export const buildAst = (declarationFile: DTS): ts.Node => {
  const ast = ts.createSourceFile('index.d.ts', '', ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);

  ast.statements = createStatements(declarationFile);

  return ast;
};
