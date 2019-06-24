import * as fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleFunctionTypescriptDeclaration } from '../ModuleDeclaration/ModuleFunctionTypescriptDeclaration';

export class ModuleFunctionTypescriptDeclarationWriter {
    write(typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration, outputDirectory: string) {
        let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);

        this.writeExportModule(fileName, typescriptModuleDeclaration);
        this.writeFunction(fileName, typescriptModuleDeclaration);
        
        if (typescriptModuleDeclaration.interfaces.length > 0 && typescriptModuleDeclaration.classes.length > 0) {
            this.openNamespace(fileName, typescriptModuleDeclaration);
            this.writeInterfaces(fileName, typescriptModuleDeclaration);
            this.writeClasses(fileName, typescriptModuleDeclaration);
            this.closeNamespace(fileName, typescriptModuleDeclaration);
        }
    }

    private writeExportModule(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        fs.appendFileSync(
            fileName,
            "export = " + this.getExportedName(typescriptModuleDeclaration) + ";\n\n"
        );
    }

    private writeFunction(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        let functionDeclaration = typescriptModuleDeclaration.methods[0];

        functionDeclaration.name = this.getExportedName(typescriptModuleDeclaration);

        fs.appendFileSync(
            fileName,
            "declare function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n"
        );
    }

    private openNamespace(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        let namespaceName = this.getExportedName(typescriptModuleDeclaration);

        fs.appendFileSync(
            fileName,
            "declare namespace " + namespaceName + " {\n"
        );
    }

    private closeNamespace(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        fs.appendFileSync(
            fileName,
            "}"
        );
    }

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
            fs.appendFileSync(
                fileName,
                "\texport interface " + i.name + " {\n"
            );

            i.getAttributes().forEach(a => {
                fs.appendFileSync(
                    fileName,
                    "\t\t'" + a.name + "': " + a.type + ";\n"
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

    private writeClasses(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
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

    private getConstructorSignature(f: FunctionDeclaration) {
        let argumentsWithType = f.getArguments().map(argument => {
            return argument.name + ": " + argument.getTypeOfs().join("|");
        }).join(", ");

        return "constructor(" + argumentsWithType + ")";
    }

    private getFunctionNameWithTypes(f: FunctionDeclaration) {
        let argumentsWithType = f.getArguments().map(argument => {
            return argument.name + ": " + argument.getTypeOfs().join("|");
        }).join(", ");

        return f.name + "(" + argumentsWithType + "): " + f.getReturnTypeOfs().join("|");
    }

    private getExportedName(typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration) {
        let n = typescriptModuleDeclaration.module.replace(/([-_][a-z])/ig, ($1: string) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });

        return n.charAt(0).toUpperCase() + n.slice(1);
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