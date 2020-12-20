import { DTSProperty } from '../../ast/types/dtsProperty';
import { mergeDTSTypes } from './createDTSType';
import { PropertyDeclaration } from '../../builder/ArgumentDeclaration';
import { DTSType, DTSTypeKeywords } from '../../ast/types';

export const createDTSProperty = (argumentDeclaration: PropertyDeclaration): DTSProperty => {
  return {
    name: argumentDeclaration.name,
    optional: argumentDeclaration.isOptional(),
    type: mergeDTSTypes(filterTypeOfs(argumentDeclaration.getTypeOfs())),
  };
};

const filterTypeOfs = (typeOfs: DTSType[]): DTSType[] => {
  if (typeOfs.length === 1) {
    return typeOfs;
  }

  return typeOfs.filter((t) => t.value !== DTSTypeKeywords.UNDEFINED);
};
