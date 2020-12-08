import { BaseTemplateTypescriptDeclaration } from '../../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { DTSNamespace } from '../../ast/types';
import { createDTSFunction } from './createDTSFunction';
import { createDTSInterface } from './createDTSInterface';
import { createDTSClass } from './createDTSClass';

export const createDTSNamespace = (
  typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  name: string,
): DTSNamespace | undefined => {
  const interfaces = typescriptModuleDeclaration.interfaces;
  const classes = typescriptModuleDeclaration.classes;
  const functions = typescriptModuleDeclaration.methods.filter((m) => !m.isExported);

  if ([...interfaces, ...classes, ...functions].length === 0) {
    return undefined;
  }

  return {
    name,
    functions: functions.map((method) => ({
      ...createDTSFunction(method),
      export: true,
    })),
    interfaces: interfaces.map((i) => createDTSInterface(i)),
    classes: classes.map((c) => createDTSClass(c)),
  };
};
