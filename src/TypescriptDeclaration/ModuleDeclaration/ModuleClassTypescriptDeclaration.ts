import { ModuleClassTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleClassTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from './BaseTemplateTypescriptDeclaration';

export class ModuleClassTypescriptDeclaration extends BaseTemplateTypescriptDeclaration {
  protected getTypescriptDeclarationWriter() {
    return new ModuleClassTypescriptDeclarationWriter();
  }
}
