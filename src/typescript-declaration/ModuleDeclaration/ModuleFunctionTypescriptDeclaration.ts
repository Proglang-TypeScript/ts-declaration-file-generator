import { ModuleFunctionTypescriptDeclarationWriter } from '../writer/ModuleFunctionTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from './BaseTemplateTypescriptDeclaration';

export class ModuleFunctionTypescriptDeclaration extends BaseTemplateTypescriptDeclaration {
  getTypescriptDeclarationWriter() {
    return new ModuleFunctionTypescriptDeclarationWriter();
  }
}
