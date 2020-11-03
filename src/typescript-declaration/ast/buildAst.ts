import ts from 'typescript';
import { DTS, DTSFunctionModifiers } from './types';
import { createFunctionDeclaration } from './helpers/createFunctionDeclaration';
import { createNamespaceDeclaration } from './helpers/createNamespaceDeclaration';
import { createInterfaceDeclaration } from './helpers/createInterfaceDeclaration';

export const buildAst = (declarationFile: DTS): ts.Node => {
  const ast = ts.createSourceFile(
    'module-ast.d.ts',
    '',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const statements = [
    ...(declarationFile.functions?.map((f) =>
      createFunctionDeclaration(f, [DTSFunctionModifiers.EXPORT]),
    ) || []),
    ...(declarationFile.namespace ? [createNamespaceDeclaration(declarationFile.namespace)] : []),
    ...(declarationFile.interfaces?.map((i) => createInterfaceDeclaration(i)) || []),
  ];

  ast.statements = (statements as unknown) as ts.NodeArray<ts.Statement>;

  return ast;
};
