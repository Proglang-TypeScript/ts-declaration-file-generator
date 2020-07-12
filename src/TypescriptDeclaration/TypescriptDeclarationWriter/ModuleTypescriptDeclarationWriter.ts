import fs from 'fs';
import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export class ModuleTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
    doWrite(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration) {
        this.writeInterfaces(this.fileName, typescriptModuleDeclaration);
        this.writeFunctions(this.fileName, typescriptModuleDeclaration);
        this.writeClasses(this.fileName, typescriptModuleDeclaration);
    }


    protected getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string {
        return "";
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            fs.appendFileSync(
                fileName,
                "export interface " + i.name + " {\n"
            );

            i.getAttributes().forEach(a => {
	    	let colon = a.optional ? "?: " : ": ";
                fs.appendFileSync(
                    fileName,
                    `\t${this.buildInterfaceAttribute(a)};\n`
                ); 
            });

            i.methods.forEach(m => {
                fs.appendFileSync(
                    fileName,
                    "\t" + this.getFunctionNameWithTypes(m) + ";\n"
                ); 
            });

            fs.appendFileSync(
                fileName,
                "}\n\n"
            );
        });
    }

    private writeFunctions(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            fs.appendFileSync(
                fileName,
                "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n"
            );
        });
    }

    private writeClasses(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.classes.forEach(classDeclaration => {
                fs.appendFileSync(
                    fileName,
                    "export class " + classDeclaration.name + " {\n"
                );

            fs.appendFileSync(
                fileName,
                "\t" + this.getConstructorSignature(classDeclaration.constructorMethod) + ";\n"
            );

            classDeclaration.getMethods().forEach(m => {
                fs.appendFileSync(
                    fileName,
                    "\t" + this.getFunctionNameWithTypes(m) + ";\n"
                );
            });

            fs.appendFileSync(
                fileName,
                "}\n\n"
            );
        });
    }
}