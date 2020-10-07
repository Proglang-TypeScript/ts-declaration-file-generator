import { BaseTemplateTypescriptDeclaration } from './BaseTemplateTypescriptDeclaration';
import { ModuleClassTypescriptDeclarationWriter } from '../writer/ModuleClassTypescriptDeclarationWriter';

export default class TemplateTypescriptDeclaration extends BaseTemplateTypescriptDeclaration {
  protected getTypescriptDeclarationWriter() {
    return new ModuleClassTypescriptDeclarationWriter();
  }
}
