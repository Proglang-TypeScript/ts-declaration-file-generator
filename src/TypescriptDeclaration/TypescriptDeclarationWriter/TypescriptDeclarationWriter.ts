import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';

export interface TypescriptDeclarationWriter {
  write(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
    outputDirectory: string,
  ): string;
}
