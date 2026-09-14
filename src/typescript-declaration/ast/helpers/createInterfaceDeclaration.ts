import { DTSInterface, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createTypeNode } from './createTypeNode';

export const createInterfaceDeclaration = (
  dtsInterface: DTSInterface,
  context?: DTS,
): ts.InterfaceDeclaration => {
  return ts.factory.createInterfaceDeclaration(
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
      return ts.factory.createPropertySignature(
        undefined,
        p.name,
        p.optional === true ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        createTypeNode(p.type, context),
      );
    }) || []
  );
};
