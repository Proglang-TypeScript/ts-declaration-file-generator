import { DTSFunction, DTSModifiers } from '../types';
import ts from 'typescript';
import { createTypeNode } from './createTypeNode';
import { createModifiers } from './createModifiers';

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

const createReturnType = (f: DTSFunction): ts.TypeNode | undefined => {
  if (f.returnType === undefined) {
    return undefined;
  }

  return createTypeNode(f.returnType);
};

const createParameters = (f: DTSFunction): ts.ParameterDeclaration[] => {
  return (
    f.parameters?.map((p) =>
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        p.name,
        p.optional === true ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        createTypeNode(p.type),
        undefined,
      ),
    ) || []
  );
};
