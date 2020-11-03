import ts from 'typescript';
import { DTS } from './types';
import { createFunctionDeclaration } from './helpers/createFunctionDeclaration';
import { createNamespaceDeclaration } from './helpers/createNamespaceDeclaration';
import { createInterfaceDeclaration } from './helpers/createInterfaceDeclaration';

export const buildAst = (declarationFile: DTS): ts.Node => {
  const ast = ts.createSourceFile(
    'module-ast.d.ts',
    '',
    ts.ScriptTarget.ES2020,
    true,
    ts.ScriptKind.TS,
  );

  const statements = [
    ...(declarationFile.functions?.map((f) => createFunctionDeclaration(f)) || []),
    ...(declarationFile.namespace ? [createNamespaceDeclaration(declarationFile.namespace)] : []),
    ...(declarationFile.interfaces?.map((i) => createInterfaceDeclaration(i)) || []),
  ];

  ast.statements = (statements as unknown) as ts.NodeArray<ts.Statement>;

  return ast;
};
