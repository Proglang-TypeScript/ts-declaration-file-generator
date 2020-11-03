import { DTSNamespace, DTSFunctionModifiers } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createFunctionDeclaration } from './createFunctionDeclaration';

export const createNamespaceDeclaration = (namespace: DTSNamespace): ts.ModuleDeclaration => {
  return ts.createModuleDeclaration(
    undefined,
    createModifiers([DTSFunctionModifiers.DECLARE]),
    ts.createIdentifier(namespace.name),
    createModuleBlock(namespace),
    ts.NodeFlags.Namespace,
  );
};

const createModuleBlock = (namespace: DTSNamespace): ts.ModuleBlock => {
  const statements = [
    ...(namespace.functions?.map((f) =>
      createFunctionDeclaration(f, [DTSFunctionModifiers.EXPORT]),
    ) || []),
  ];

  return ts.createModuleBlock(statements);
};
