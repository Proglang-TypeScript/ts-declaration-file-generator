import { ModuleTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from './BaseModuleTypescriptDeclaration';

export class ModuleTypescriptDeclaration extends BaseModuleTypescriptDeclaration {
    getTypescriptDeclarationWriter() {
        return new ModuleTypescriptDeclarationWriter();
    }
}