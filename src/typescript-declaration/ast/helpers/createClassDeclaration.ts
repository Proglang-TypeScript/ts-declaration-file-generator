import { DTSClass, DTSModifiers, DTS } from '../types';
import ts from 'typescript';
import { createModifiers } from './createModifiers';
import { createParameter } from './createParameter';
import { createReturnType } from './createReturnType';

export const createClassDeclaration = (dtsClass: DTSClass, context?: DTS): ts.ClassDeclaration => {
  return ts.createClassDeclaration(
    undefined,
    createModifiers([dtsClass.export !== false ? DTSModifiers.EXPORT : DTSModifiers.DECLARE]),
    ts.createIdentifier(dtsClass.name),
    undefined,
    undefined,
    [...createConstructors(dtsClass, context), ...createMethods(dtsClass, context)],
  );
};

const createConstructors = (dtsClass: DTSClass, context?: DTS): ts.ConstructorDeclaration[] => {
  return (
    dtsClass.constructors?.map((constructor) =>
      ts.createConstructor(
        undefined,
        undefined,
        constructor.parameters?.map((parameter) => createParameter(parameter, context)) || [],
        undefined,
      ),
    ) || []
  );
};

const createMethods = (dtsClass: DTSClass, context?: DTS): ts.MethodDeclaration[] => {
  return (
    dtsClass.methods?.map((m) =>
      ts.createMethod(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier(m.name),
        undefined,
        undefined,
        m.parameters?.map((p) => createParameter(p, context)) || [],
        createReturnType(m, context),
        undefined,
      ),
    ) || []
  );
};
