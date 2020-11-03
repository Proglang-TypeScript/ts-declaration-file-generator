import { DTSFunction, DTSFunctionModifiers } from '../types';
import ts from 'typescript';
import { createTypeNode } from './createTypeNode';
import { createModifiers } from './createModifiers';

export const createFunctionDeclaration = (
  dtsFunction: DTSFunction,
  modifiers: DTSFunctionModifiers[] = [],
): ts.FunctionDeclaration => {
  return ts.createFunctionDeclaration(
    undefined,
    createModifiers(modifiers),
    undefined,
    ts.createIdentifier(dtsFunction.name),
    undefined,
    [],
    createReturnType(dtsFunction),
    undefined,
  );
};

const createReturnType = (f: DTSFunction): ts.TypeNode | undefined => {
  if (f.returnType === undefined) {
    return undefined;
  }

  return createTypeNode(f.returnType);
};
