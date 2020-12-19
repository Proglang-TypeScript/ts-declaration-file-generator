import { RuntimeInfo } from '../../../runtime-info/parser/parsedTypes';
import { TypescriptDeclaration } from '../types/TypescriptDeclaration';
import { DTS } from '../../ast/types';
import { extractModuleName } from './extractModuleName';
import { createDTSModuleClass } from '../../dts/moduleClass';
import { createDTSModuleFunction } from '../../dts/moduleFunction';
import { createDTSModule } from '../../dts/module';

type CreateDTS = (typescriptDeclaration: TypescriptDeclaration) => DTS;

export const getCreateDTSFn = (runTimeInfo: RuntimeInfo, moduleName: string): CreateDTS => {
  for (const key in runTimeInfo) {
    const functionRunTimeInfo = runTimeInfo[key];

    if (extractModuleName(functionRunTimeInfo.requiredModule) === moduleName) {
      if (functionRunTimeInfo.isExported === true) {
        if (functionRunTimeInfo.isConstructor === true) {
          return createDTSModuleClass;
        } else {
          return createDTSModuleFunction;
        }
      }
    }
  }

  return createDTSModule;
};
