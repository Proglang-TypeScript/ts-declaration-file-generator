import { ModuleFunctionTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleFunctionTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from './BaseTemplateTypescriptDeclaration';

export class ModuleFunctionTypescriptDeclaration extends BaseTemplateTypescriptDeclaration {
  getTypescriptDeclarationWriter() {
    return new ModuleFunctionTypescriptDeclarationWriter();
  }
}
