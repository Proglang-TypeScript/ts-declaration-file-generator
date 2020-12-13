import { createDTSProperty } from './createDTSProperty';
import { DTSClass } from '../../ast/types';
import { ClassDeclaration } from '../../ClassDeclaration';
import { createDTSType } from './createDTSType';

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
    returnType: createDTSType(method.getReturnTypeOfs()),
  })),
});
