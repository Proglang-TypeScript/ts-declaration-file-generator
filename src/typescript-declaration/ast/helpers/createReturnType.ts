import { DTSFunction, DTS } from '../types';
import ts from 'typescript';
import { createTypeNode } from './createTypeNode';

export const createReturnType = (
  dtsFunction: DTSFunction,
  context?: DTS,
): ts.TypeNode | undefined => {
  if (dtsFunction.returnType === undefined) {
    return undefined;
  }

  return createTypeNode(dtsFunction.returnType, context);
};
