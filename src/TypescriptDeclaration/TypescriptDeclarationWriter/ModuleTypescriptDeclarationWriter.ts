import fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleTypescriptDeclaration } from "../ModuleDeclaration/ModuleTypescriptDeclaration";
import { InterfaceAttributeDeclaration } from '../InterfaceDeclaration';

export class ModuleTypescriptDeclarationWriter {
    write(typescriptModuleDeclaration: ModuleTypescriptDeclaration, outputDirectory: string) {
        let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);
        
        this.writeInterfaces(fileName, typescriptModuleDeclaration);
        this.writeFunctions(fileName, typescriptModuleDeclaration);
        this.writeClasses(fileName, typescriptModuleDeclaration);
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: ModuleTypescriptDeclaration): void {
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

    private writeFunctions(fileName: string, typescriptModuleDeclaration: ModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            fs.appendFileSync(
                fileName,
                "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n"
            );
        });
    }

    private writeClasses(fileName: string, typescriptModuleDeclaration: ModuleTypescriptDeclaration): void {
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

    private getConstructorSignature(f: FunctionDeclaration) {
        let argumentsWithType = this.buildArgumentsWithType(f);

        return "constructor(" + argumentsWithType + ")";
    }

    private getFunctionNameWithTypes(f: FunctionDeclaration) {
        let argumentsWithType = this.buildArgumentsWithType(f);

        return `${f.name}(${argumentsWithType.join(", ")}): ${f.getReturnTypeOfs().join(" | ")}`;
    }

    private cleanOutput(filePath: string, fileName: string) : void {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    }

    private buildInterfaceAttribute(a: InterfaceAttributeDeclaration): string {
        let types = a.type;
        if (types.length > 1) {
            types = types.filter(t => t !== "undefined");
        }

        return `'${a.name}'${a.optional ? "?" : ""}: ${types.join(" | ")}`;
    }

    private buildArgumentsWithType(f: FunctionDeclaration, mapping?: ((s: string) => string)): string[] {
        return f.getArguments().map(argument => {
            let argumentTypes = argument.getTypeOfs();
            let colon = ":";
            if (argument.isOptional()) {
                if (argumentTypes.length > 1) {
                    argumentTypes = argumentTypes.filter(t => t !== "undefined");
                }

                colon = "?:"
            }

            return `${argument.name}${colon} ${argumentTypes
                .map(mapping || ((a: string) => a))
                .join(" | ")}`;
        });
    }
}