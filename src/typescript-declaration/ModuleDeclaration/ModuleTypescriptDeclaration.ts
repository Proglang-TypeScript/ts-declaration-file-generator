import { ModuleTypescriptDeclarationWriter } from '../writer/ModuleTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from './BaseTemplateTypescriptDeclaration';

export class ModuleTypescriptDeclaration extends BaseTemplateTypescriptDeclaration {
  getTypescriptDeclarationWriter() {
    return new ModuleTypescriptDeclarationWriter();
  }
}
