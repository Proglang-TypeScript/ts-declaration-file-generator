import * as fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleTypescriptDeclaration } from "../ModuleDeclaration/ModuleTypescriptDeclaration";

export class ModuleTypescriptDeclarationWriter {
    write(typescriptModuleDeclaration: ModuleTypescriptDeclaration, outputDirectory: string) {
        let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);
        
        this.writeInterfaces(fileName, typescriptModuleDeclaration);
        this.writeFunctions(fileName, typescriptModuleDeclaration);
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: ModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            fs.appendFileSync(
                fileName,
                "export interface " + i.name + " {\n"
            );

            i.getAttributes().forEach(a => {
                fs.appendFileSync(
                    fileName,
                    "\t'" + a.name + "': " + a.type + ";\n"
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

    private writeFunctions(fileName: string, typescriptModuleDeclaration: ModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            fs.appendFileSync(
                fileName,
                "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n"
            );
        });
    }
    private getFunctionNameWithTypes(f: FunctionDeclaration) {
        let argumentsWithType = f.getArguments().map(argument => {
            return argument.name + ": " + argument.getTypeOfs().join("|");
        }).join(", ");

        return f.name + "(" + argumentsWithType + "): " + f.getReturnTypeOfs().join("|");
    }

    private cleanOutput(filePath: string, fileName: string) : void {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    }
}