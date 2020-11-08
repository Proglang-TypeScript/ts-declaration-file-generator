import { DTSClass, DTSModifiers } from '../types';
import ts, { createIdentifier } from 'typescript';
import { createModifiers } from './createModifiers';
import { createParameter } from './createParameter';
import { createReturnType } from './createReturnType';

export const createClassDeclaration = (dtsClass: DTSClass): ts.ClassDeclaration => {
  return ts.createClassDeclaration(
    undefined,
    createModifiers([dtsClass.export !== false ? DTSModifiers.EXPORT : DTSModifiers.DECLARE]),
    createIdentifier(dtsClass.name),
    undefined,
    undefined,
    [...createConstructors(dtsClass), ...createMethods(dtsClass)],
  );
};

const createConstructors = (dtsClass: DTSClass): ts.ConstructorDeclaration[] => {
  return (
    dtsClass.constructors?.map((constructor) =>
      ts.createConstructor(
        undefined,
        undefined,
        constructor.parameters?.map((parameter) => createParameter(parameter)) || [],
        undefined,
      ),
    ) || []
  );
};

const createMethods = (dtsClass: DTSClass): ts.MethodDeclaration[] => {
  return (
    dtsClass.methods?.map((m) =>
      ts.createMethod(
        undefined,
        undefined,
        undefined,
        createIdentifier(m.name),
        undefined,
        undefined,
        m.parameters?.map((p) => createParameter(p)) || [],
        createReturnType(m),
        undefined,
      ),
    ) || []
  );
};
