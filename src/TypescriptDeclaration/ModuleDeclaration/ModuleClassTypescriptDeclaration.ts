import { FunctionDeclaration } from '../FunctionDeclaration';
import { ModuleClassTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleClassTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from './BaseModuleTypescriptDeclaration';

export class ModuleClassTypescriptDeclaration extends BaseModuleTypescriptDeclaration {
    protected getTypescriptDeclarationWriter() {
        return new ModuleClassTypescriptDeclarationWriter();
    }
}