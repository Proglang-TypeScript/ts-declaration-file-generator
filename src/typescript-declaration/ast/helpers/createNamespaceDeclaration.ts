import { DTSNamespace, DTSModifiers } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createStatements } from './createStatements';

export const createNamespaceDeclaration = (namespace: DTSNamespace): ts.ModuleDeclaration => {
  return ts.createModuleDeclaration(
    undefined,
    createModifiers([DTSModifiers.DECLARE]),
    ts.createIdentifier(namespace.name),
    createModuleBlock(namespace),
    ts.NodeFlags.Namespace,
  );
};

const createModuleBlock = (namespace: DTSNamespace): ts.ModuleBlock => {
  const statements = createStatements(namespace);

  return ts.createModuleBlock(statements);
};
