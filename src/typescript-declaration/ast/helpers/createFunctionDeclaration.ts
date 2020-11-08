import { DTSFunction, DTSModifiers } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createParameter } from './createParameter';
import { createReturnType } from './createReturnType';

export const createFunctionDeclaration = (dtsFunction: DTSFunction): ts.FunctionDeclaration => {
  return ts.createFunctionDeclaration(
    undefined,
    createModifiers([dtsFunction.export !== false ? DTSModifiers.EXPORT : DTSModifiers.DECLARE]),
    undefined,
    ts.createIdentifier(dtsFunction.name),
    undefined,
    createParameters(dtsFunction),
    createReturnType(dtsFunction),
    undefined,
  );
};

const createParameters = (f: DTSFunction): ts.ParameterDeclaration[] => {
  return f.parameters?.map((p) => createParameter(p)) || [];
};
