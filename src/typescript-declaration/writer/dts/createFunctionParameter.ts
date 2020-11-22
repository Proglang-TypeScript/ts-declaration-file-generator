import ArgumentDeclaration from '../../ArgumentDeclaration';
import { DTSProperty } from '../../ast/types/dtsProperty';
import { createDTSType } from './createDTSType';

export const createFunctionParameter = (argumentDeclaration: ArgumentDeclaration): DTSProperty => {
  return {
    name: argumentDeclaration.name,
    optional: argumentDeclaration.isOptional(),
    type: createDTSType(filterTypeOfs(argumentDeclaration.getTypeOfs())),
  };
};

const filterTypeOfs = (typeOfs: string[]): string[] => {
  if (typeOfs.length === 1) {
    return typeOfs;
  }

  return typeOfs.filter((t) => t !== 'undefined');
};
