import { TypescriptDeclaration } from './types/TypescriptDeclaration';
import { createDTSNamespace } from './dts-helpers/createDTSNamespace';
import { DTS } from '../ast/types';
import { createDTSFunction } from './dts-helpers/createDTSFunction';

export const createDTSModuleFunction = (typescriptDeclaration: TypescriptDeclaration): DTS => ({
  exportAssignment: getExportedName(typescriptDeclaration),
  functions: typescriptDeclaration.methods
    .filter((method) => method.isExported === true)
    .map((method) => ({
      ...createDTSFunction(method),
      name: getExportedName(typescriptDeclaration),
      export: false,
    })),
  namespace: createDTSNamespace(
    {
      interfaces: typescriptDeclaration.interfaces,
      classes: typescriptDeclaration.classes,
      functions: typescriptDeclaration.methods.filter((m) => !m.isExported),
    },
    getExportedName(typescriptDeclaration),
  ),
});

const getExportedName = (typescriptDeclaration: TypescriptDeclaration): string => {
  const n = typescriptDeclaration.module.replace(/([-_][a-z])/gi, ($1: string) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });

  return n.charAt(0).toUpperCase() + n.slice(1);
};
