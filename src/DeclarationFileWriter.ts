import * as fs from 'fs';
import { FunctionDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import { TypescriptModuleDeclaration } from "./TypescriptDeclaration/TypescriptModuleDeclaration";

export class DeclarationFileWriter {
    outputDirectory: string;

    constructor() {
        this.outputDirectory = "output";
    }

    write(typescriptModuleDeclaration: TypescriptModuleDeclaration) {
        let filePath = this.outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);
        
        this.writeExportModule(fileName, typescriptModuleDeclaration);
        this.writeNamespace(fileName, typescriptModuleDeclaration);
        this.writeInterfaces(fileName, typescriptModuleDeclaration);
        this.writeMethods(fileName, typescriptModuleDeclaration);
        
        fs.appendFileSync(
            fileName,
            "}"
        );
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: TypescriptModuleDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            fs.appendFileSync(
                fileName,
                "\texport interface " + i.name + " {\n"
            );

            i.getAttributes().forEach(a => {
                fs.appendFileSync(
                    fileName,
                    "\t\t" + a.name + ": " + a.type + ";\n"
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

    private writeMethods(fileName: string, typescriptModuleDeclaration: TypescriptModuleDeclaration): void {
        typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            fs.appendFileSync(
                fileName,
                "\texport function " + this.getFunctionNameWithTypes(functionDeclaration) + "\n"
            );
        });
    }

    private getFunctionNameWithTypes(f: FunctionDeclaration) {
        let argumentsWithType = f.getArguments().map(argument => {
            return argument.name + ": " + argument.typeOfs.join("|");
        }).join(", ");

        return f.name + "(" + argumentsWithType + "): " + f.getReturnTypeOfs().join("|");
    }

    private writeNamespace(fileName: string, typescriptModuleDeclaration: TypescriptModuleDeclaration): void {
        fs.appendFileSync(
            fileName,
            "declare namespace " + typescriptModuleDeclaration.module + " {"  + "\n"
        );
    }

    private writeExportModule(fileName: string, typescriptModuleDeclaration: TypescriptModuleDeclaration): void {
        fs.appendFileSync(
            fileName,
            "export = " + typescriptModuleDeclaration.module + "\n\n"
        );
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