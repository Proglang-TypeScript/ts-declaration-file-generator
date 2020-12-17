import { DTSNamespace } from '../../ast/types';
import { createDTSFunction } from './createDTSFunction';
import { createDTSInterface } from './createDTSInterface';
import { createDTSClass } from './createDTSClass';
import { ClassDeclaration } from '../../builder/ClassDeclaration';
import { FunctionDeclaration } from '../../builder/FunctionDeclaration';
import { InterfaceDeclaration } from '../../builder/InterfaceDeclaration';

export const createDTSNamespace = (
  {
    interfaces,
    classes,
    functions,
  }: {
    interfaces: InterfaceDeclaration[];
    classes: ClassDeclaration[];
    functions: FunctionDeclaration[];
  },
  name: string,
): DTSNamespace | undefined => {
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
