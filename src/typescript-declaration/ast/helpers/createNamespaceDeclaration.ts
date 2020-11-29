import { DTSNamespace, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createStatements } from './createStatements';

export const createNamespaceDeclaration = (
  namespace: DTSNamespace,
  context?: DTS,
): ts.ModuleDeclaration => {
  return ts.createModuleDeclaration(
    undefined,
    createModifiers([DTSModifiers.DECLARE]),
    ts.createIdentifier(namespace.name),
    ts.createModuleBlock(createStatements(namespace, context)),
    ts.NodeFlags.Namespace,
  );
};
