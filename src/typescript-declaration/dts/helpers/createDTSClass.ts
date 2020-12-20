import { createDTSProperty } from './createDTSProperty';
import { DTSClass } from '../../ast/types';
import { ClassDeclaration } from '../../builder/ClassDeclaration';
import { createDTSTypeFromString } from './createDTSType';

export const createDTSClass = (classDeclaration: ClassDeclaration): DTSClass => ({
  name: classDeclaration.name,
  constructors: [
    {
      parameters: classDeclaration.constructorMethod
        .getArguments()
        .map((argument) => createDTSProperty(argument)),
    },
  ],
  methods: classDeclaration.getMethods().map((method) => ({
    name: method.name,
    parameters: method.getArguments().map((argument) => createDTSProperty(argument)),
    returnType: createDTSTypeFromString(method.getReturnTypeOfs()),
  })),
});
