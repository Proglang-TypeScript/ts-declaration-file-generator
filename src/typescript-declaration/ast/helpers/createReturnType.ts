import { DTSFunction } from '../types';
import ts from 'typescript';
import { createTypeNode } from './createTypeNode';

export const createReturnType = (dtsFunction: DTSFunction): ts.TypeNode | undefined => {
  if (dtsFunction.returnType === undefined) {
    return undefined;
  }

  return createTypeNode(dtsFunction.returnType);
};
