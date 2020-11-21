import ArgumentDeclaration from '../../ArgumentDeclaration';
import { DTSProperty } from '../../ast/types/dtsProperty';
import { createDTSType } from './createDTSType';

export const createFunctionParameter = (argumentDeclaration: ArgumentDeclaration): DTSProperty => {
  return {
    name: argumentDeclaration.name,
    optional: argumentDeclaration.isOptional(),
    type: createDTSType(argumentDeclaration.getTypeOfs()),
  };
};
