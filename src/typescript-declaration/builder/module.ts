import { TypescriptDeclaration } from './types/TypescriptDeclaration';
import { DTS } from '../ast/types';
import { createDTSFunction } from './dts-helpers/createDTSFunction';
import { createDTSClass } from './dts-helpers/createDTSClass';
import { createDTSInterface } from './dts-helpers/createDTSInterface';

export const createDTSModule = (typescriptDeclaration: TypescriptDeclaration): DTS => ({
  classes: typescriptDeclaration.classes.map((c) => createDTSClass(c)),
  functions: typescriptDeclaration.methods.map((m) => createDTSFunction(m)),
  interfaces: typescriptDeclaration.interfaces.map((i) => createDTSInterface(i)),
});
