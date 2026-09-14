import { DTSNamespace, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createStatements } from './createStatements';

export const createNamespaceDeclaration = (
  namespace: DTSNamespace,
  context?: DTS,
): ts.ModuleDeclaration => {
  return ts.factory.createModuleDeclaration(
    createModifiers([DTSModifiers.DECLARE]),
    ts.factory.createIdentifier(namespace.name),
    ts.factory.createModuleBlock(createStatements(namespace, context)),
    ts.NodeFlags.Namespace,
  );
};
