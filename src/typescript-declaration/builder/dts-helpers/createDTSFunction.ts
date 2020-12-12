import { createDTSProperty } from './createDTSProperty';
import { FunctionDeclaration } from '../../FunctionDeclaration';
import { createDTSType } from './createDTSType';
import { DTSFunction } from '../../ast/types';

export const createDTSFunction = (functionDeclaration: FunctionDeclaration): DTSFunction => ({
  name: functionDeclaration.name,
  parameters: functionDeclaration.getArguments().map((argument) => createDTSProperty(argument)),
  returnType: createDTSType(functionDeclaration.getReturnTypeOfs()),
});
