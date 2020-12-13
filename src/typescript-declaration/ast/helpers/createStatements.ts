import { DTS } from '../types';
import { createInterfaceDeclaration } from './createInterfaceDeclaration';
import { createFunctionDeclaration } from './createFunctionDeclaration';
import { createNamespaceDeclaration } from './createNamespaceDeclaration';
import ts from 'typescript';
import { createClassDeclaration } from './createClassDeclaration';

export const createStatements = (
  declarationFile: DTS,
  context?: DTS,
): ts.NodeArray<ts.Statement> => {
  const exportAssignment = declarationFile.exportAssignment
    ? createExportAssignment(declarationFile.exportAssignment)
    : null;

  const interfaces =
    declarationFile.interfaces?.map((i) =>
      createInterfaceDeclaration(i, context || declarationFile),
    ) || [];

  const functions =
    declarationFile.functions?.map((f) =>
      createFunctionDeclaration(f, context || declarationFile),
    ) || [];

  const classes =
    declarationFile.classes?.map((c) => createClassDeclaration(c, context || declarationFile)) ||
    [];

  const namespace = declarationFile.namespace
    ? createNamespaceDeclaration(declarationFile.namespace, context || declarationFile)
    : null;

  const statements = [
    ...(exportAssignment ? [exportAssignment] : []),
    ...interfaces,
    ...functions,
    ...classes,
    ...(namespace ? [namespace] : []),
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
