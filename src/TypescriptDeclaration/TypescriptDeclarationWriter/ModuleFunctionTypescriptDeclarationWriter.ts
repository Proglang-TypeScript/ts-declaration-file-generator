import fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleFunctionTypescriptDeclaration } from '../ModuleDeclaration/ModuleFunctionTypescriptDeclaration';
import { InterfaceAttributeDeclaration } from '../InterfaceDeclaration';

export class ModuleFunctionTypescriptDeclarationWriter {
    interfaceNames: string[];
    private exportNamespace: string;

    constructor() {
        this.interfaceNames = [];
        this.exportNamespace = "";
    }

    write(typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration, outputDirectory: string) {
        this.interfaceNames = typescriptModuleDeclaration.interfaces.map(i => {
            return i.name;
        });

        let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);

        this.exportNamespace = this.getExportedName(typescriptModuleDeclaration);

        this.writeExportModule(fileName);
        this.writeFunction(fileName, typescriptModuleDeclaration);
        
        if (
            typescriptModuleDeclaration.interfaces.length > 0 ||
            typescriptModuleDeclaration.classes.length > 0 ||
            typescriptModuleDeclaration.methods.length > 1
        ) {
            this.openNamespace(fileName);
            this.writeInterfaces(fileName, typescriptModuleDeclaration);
            this.writeClasses(fileName, typescriptModuleDeclaration);
            this.writeFunctions(fileName, typescriptModuleDeclaration);
            this.closeNamespace(fileName, typescriptModuleDeclaration);
        }
    }

    private writeExportModule(fileName: string): void {
        fs.appendFileSync(
            fileName,
            "export = " + this.exportNamespace + ";\n\n"
        );
    }

    private writeFunction(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        let exportedFunctionDeclarations = typescriptModuleDeclaration.methods.filter(t => (t.isExported === true));

        exportedFunctionDeclarations.forEach(exportedFunctionDeclaration => {
            exportedFunctionDeclaration.name = this.exportNamespace;
    
            fs.appendFileSync(
                fileName,
                "declare function " + this.getFunctionNameWithTypes(exportedFunctionDeclaration) + ";\n"
            );
        })
    }

    private writeFunctions(fileName: string, typescriptModuleDeclaration: ModuleFunctionTypescriptDeclaration): void {
        typescriptModuleDeclaration.methods.filter(t => (t.isExported !== true)).forEach(innerNotExportedFunction => {
            fs.appendFileSync(
                fileName,
                "\texport function " + this.getFunctionNameWithTypes(innerNotExportedFunction) + ";\n"
            );
        });
    }

    private openNamespace(fileName: string): void {
        fs.appendFileSync(
            fileName,
            "declare namespace " + this.exportNamespace + " {\n"
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
        let argumentsWithType = this.buildArgumentsWithType(f, this.mapArgumenTypeToNamespace(this.exportNamespace));

        return "constructor(" + argumentsWithType + ")";
    }

    private getFunctionNameWithTypes(f: FunctionDeclaration) {
        let argumentsWithType = this.buildArgumentsWithType(f, this.mapArgumenTypeToNamespace(f.name));

        return `${f.name}(${argumentsWithType.join(", ")}): ${f.getReturnTypeOfs().join(" | ")}`;
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

    private mapArgumenTypeToNamespace(namespace: string) {
        return (argumentType: string) => {
            let newType = argumentType;
            if (this.interfaceNames.indexOf(newType) !== -1) {
                newType = namespace + "." + newType;
            }

            return newType;
        };
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

    private buildInterfaceAttribute(a: InterfaceAttributeDeclaration): string {
        let types = a.type;
        if (types.length > 1) {
            types = types.filter(t => t !== "undefined");
        }

        return `'${a.name}'${a.optional ? "?" : ""}: ${types.join(" | ")}`;
    }
}