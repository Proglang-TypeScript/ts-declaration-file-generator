import { DTSInterface, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createTypeNode } from './createTypeNode';

export const createInterfaceDeclaration = (
  dtsInterface: DTSInterface,
  context?: DTS,
): ts.InterfaceDeclaration => {
  return ts.createInterfaceDeclaration(
    undefined,
    createModifiers([DTSModifiers.EXPORT]),
    dtsInterface.name,
    undefined,
    undefined,
    [...createProperties(dtsInterface, context)],
  );
};

const createProperties = (dtsInterface: DTSInterface, context?: DTS): ts.PropertySignature[] => {
  return (
    dtsInterface.properties?.map((p) => {
      return ts.createPropertySignature(
        undefined,
        p.name,
        undefined,
        createTypeNode(p.type, context),
        undefined,
      );
    }) || []
  );
};
