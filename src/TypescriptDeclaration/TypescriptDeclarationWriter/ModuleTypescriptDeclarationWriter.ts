import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export class ModuleTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
    doWrite(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration) {
        this.writeInterfaces(typescriptModuleDeclaration);
        this.writeFunctions(typescriptModuleDeclaration);
        this.writeClasses(typescriptModuleDeclaration);
    }

    protected getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string {
        return "";
    }

    private writeInterfaces(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            this.fileContents += "export interface " + i.name + " {\n";

            i.getAttributes().forEach(a => {
                this.fileContents += `\t${this.buildInterfaceAttribute(a)};\n`;
            });

            i.methods.forEach(m => {
                this.fileContents += "\t" + this.getFunctionNameWithTypes(m) + ";\n";
            });

            this.fileContents += "}\n\n";
        });
    }

    private writeFunctions(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            this.fileContents += "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n";
        });
    }

    private writeClasses(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.classes.forEach(classDeclaration => {
            this.fileContents += "export class " + classDeclaration.name + " {\n";

            this.fileContents += "\t" + this.getConstructorSignature(classDeclaration.constructorMethod) + ";\n";

            classDeclaration.getMethods().forEach(m => {
                this.fileContents += "\t" + this.getFunctionNameWithTypes(m) + ";\n";
            });

            this.fileContents += "}\n\n";
        });
    }
}