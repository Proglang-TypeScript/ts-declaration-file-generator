import { createDTSProperty } from './createDTSProperty';
import { FunctionDeclaration } from '../../builder/FunctionDeclaration';
import { createDTSTypeFromString } from './createDTSType';
import { DTSFunction } from '../../ast/types';

export const createDTSFunction = (functionDeclaration: FunctionDeclaration): DTSFunction => ({
  name: functionDeclaration.name,
  parameters: functionDeclaration.getArguments().map((argument) => createDTSProperty(argument)),
  returnType: createDTSTypeFromString(functionDeclaration.getReturnTypeOfs()),
});
