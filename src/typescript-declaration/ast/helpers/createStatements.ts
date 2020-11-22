import { DTS } from '../types';
import { createInterfaceDeclaration } from './createInterfaceDeclaration';
import { createFunctionDeclaration } from './createFunctionDeclaration';
import { createNamespaceDeclaration } from './createNamespaceDeclaration';
import ts from 'typescript';
import { createClassDeclaration } from './createClassDeclaration';

export const createStatements = (declarationFile: DTS): ts.NodeArray<ts.Statement> => {
  const statements = [
    ...(declarationFile.exportAssignment
      ? [createExportAssignment(declarationFile.exportAssignment)]
      : []),
    ...(declarationFile.interfaces?.map((i) => createInterfaceDeclaration(i)) || []),
    ...(declarationFile.functions?.map((f) => createFunctionDeclaration(f)) || []),
    ...(declarationFile.classes?.map((c) => createClassDeclaration(c)) || []),
    ...(declarationFile.namespace ? [createNamespaceDeclaration(declarationFile.namespace)] : []),
  ];

  return (statements as unknown) as ts.NodeArray<ts.Statement>;
};

const createExportAssignment = (exportAssignment: string): ts.ExportAssignment => {
  return ts.createExportAssignment(
    undefined,
    undefined,
    true,
    ts.createIdentifier(exportAssignment),
  );
};
