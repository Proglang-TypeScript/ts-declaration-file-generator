import fs from 'fs';
import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export class ModuleFunctionTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
    protected doWrite(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration) {
        this.writeExportModule(this.fileName);
        this.writeFunction(this.fileName, typescriptModuleDeclaration);

        if (
            typescriptModuleDeclaration.interfaces.length > 0 ||
            typescriptModuleDeclaration.classes.length > 0 ||
            typescriptModuleDeclaration.methods.length > 1
        ) {
            this.openNamespace(this.fileName);
            this.writeInterfaces(this.fileName, typescriptModuleDeclaration);
            this.writeClasses(this.fileName, typescriptModuleDeclaration);
            this.writeFunctions(this.fileName, typescriptModuleDeclaration);
            this.closeNamespace(this.fileName, typescriptModuleDeclaration);
        }
    }

    protected getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string {
        let n = typescriptModuleDeclaration.module.replace(/([-_][a-z])/ig, ($1: string) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });

        return n.charAt(0).toUpperCase() + n.slice(1);
    }

    private writeFunction(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        let exportedFunctionDeclarations = typescriptModuleDeclaration.methods.filter(t => (t.isExported === true));

        exportedFunctionDeclarations.forEach(exportedFunctionDeclaration => {
            exportedFunctionDeclaration.name = this.exportNamespace;
    
            fs.appendFileSync(
                fileName,
                "declare function " + this.getFunctionNameWithTypes(exportedFunctionDeclaration) + ";\n"
            );
        })
    }

    private writeFunctions(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.filter(t => (t.isExported !== true)).forEach(innerNotExportedFunction => {
            fs.appendFileSync(
                fileName,
                "\texport function " + this.getFunctionNameWithTypes(innerNotExportedFunction) + ";\n"
            );
        });
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            fs.appendFileSync(
                fileName,
                "\texport interface " + i.name + " {\n"
            );

            i.getAttributes().forEach(a => {
                fs.appendFileSync(
                    fileName,
                    `\t\t${this.buildInterfaceAttribute(a)};\n`
                );
            });

            i.methods.forEach(m => {
                fs.appendFileSync(
                    fileName,
                    "\t\t" + this.getFunctionNameWithTypes(m) + ";\n"
                ); 
            });

            fs.appendFileSync(
                fileName,
                "\t}\n\n"
            );
        });
    }

    private writeClasses(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.classes.forEach(classDeclaration => {
            fs.appendFileSync(
                fileName,
                "\texport class " + classDeclaration.name + " {\n"
            );

            fs.appendFileSync(
                fileName,
                "\t\t" + this.getConstructorSignature(classDeclaration.constructorMethod) + ";\n"
            );

            classDeclaration.getMethods().forEach(m => {
                fs.appendFileSync(
                    fileName,
                    "\t\t" + this.getFunctionNameWithTypes(m) + ";\n"
                );
            });

            fs.appendFileSync(
                fileName,
                "\t}\n\n"
            );
        });
    }
}