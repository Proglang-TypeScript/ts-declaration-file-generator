import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export interface TypescriptDeclarationWriter {
  write(
    typescriptModuleDeclaration: BaseModuleTypescriptDeclaration,
    outputDirectory: string,
  ): string;
}
