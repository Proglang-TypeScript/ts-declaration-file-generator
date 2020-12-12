import { TypescriptDeclaration } from './types/TypescriptDeclaration';
import { createDTSNamespace } from './dts-helpers/createDTSNamespace';
import { createDTSClass } from './dts-helpers/createDTSClass';
import { DTS } from '../ast/types';

export const createDTSModuleClass = (typescriptDeclaration: TypescriptDeclaration): DTS => ({
  exportAssignment: getExportedName(typescriptDeclaration),
  classes: typescriptDeclaration.classes[0] && [
    { ...createDTSClass(typescriptDeclaration.classes[0]), export: false },
  ],
  namespace: createDTSNamespace(
    {
      interfaces: typescriptDeclaration.interfaces,
      classes: typescriptDeclaration.classes.slice(1),
      functions: typescriptDeclaration.methods,
    },
    getExportedName(typescriptDeclaration),
  ),
});

const getExportedName = (typescriptDeclaration: TypescriptDeclaration): string =>
  typescriptDeclaration.classes[0].name || '';
