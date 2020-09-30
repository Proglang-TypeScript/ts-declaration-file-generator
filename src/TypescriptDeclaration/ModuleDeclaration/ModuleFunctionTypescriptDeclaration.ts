import { ModuleFunctionTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleFunctionTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from './BaseModuleTypescriptDeclaration';

export class ModuleFunctionTypescriptDeclaration extends BaseModuleTypescriptDeclaration {
  getTypescriptDeclarationWriter() {
    return new ModuleFunctionTypescriptDeclarationWriter();
  }
}
