import { TypescriptDeclaration } from '../builder/types/TypescriptDeclaration';
import { DTS } from '../ast/types';
import { createDTSFunction } from './helpers/createDTSFunction';
import { createDTSClass } from './helpers/createDTSClass';
import { createDTSInterface } from './helpers/createDTSInterface';

export const createDTSModule = (typescriptDeclaration: TypescriptDeclaration): DTS => ({
  classes: typescriptDeclaration.classes.map((c) => createDTSClass(c)),
  functions: typescriptDeclaration.methods.map((m) => createDTSFunction(m)),
  interfaces: typescriptDeclaration.interfaces.map((i) => createDTSInterface(i)),
});
