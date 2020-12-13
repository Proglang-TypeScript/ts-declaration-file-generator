import { DTSFunction, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createParameter } from './createParameter';
import { createReturnType } from './createReturnType';

export const createFunctionDeclaration = (
  dtsFunction: DTSFunction,
  context?: DTS,
): ts.FunctionDeclaration => {
  return ts.createFunctionDeclaration(
    undefined,
    createModifiers([dtsFunction.export !== false ? DTSModifiers.EXPORT : DTSModifiers.DECLARE]),
    undefined,
    ts.createIdentifier(dtsFunction.name),
    undefined,
    createParameters(dtsFunction, context),
    createReturnType(dtsFunction, context),
    undefined,
  );
};

const createParameters = (f: DTSFunction, context?: DTS): ts.ParameterDeclaration[] => {
  return f.parameters?.map((p) => createParameter(p, context)) || [];
};
