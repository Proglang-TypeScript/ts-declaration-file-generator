import { DTSProperty } from '../../ast/types/dtsProperty';
import { createDTSType } from './createDTSType';

type PropertyDeclaration = {
  name: string;
  isOptional(): boolean;
  getTypeOfs(): string[];
};

export const createDTSProperty = (argumentDeclaration: PropertyDeclaration): DTSProperty => {
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
