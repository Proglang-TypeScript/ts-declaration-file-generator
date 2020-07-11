import fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { InterfaceAttributeDeclaration } from '../InterfaceDeclaration';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export abstract class BaseTypescriptDeclarationWriter {
    interfaceNames: string[];
	protected exportNamespace: string;
	protected fileName: string;

	protected abstract doWrite(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void;
	protected abstract getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string;

    constructor() {
        this.interfaceNames = [];
		this.exportNamespace = ""
		this.fileName = "";
    }

	write(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration, outputDirectory: string) {
        this.interfaceNames = typescriptModuleDeclaration.interfaces.map(i => {
            return i.name;
        });

        let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
		let fileName = filePath + "/index.d.ts";
		this.fileName = fileName;
        this.cleanOutput(filePath, fileName);

		this.exportNamespace = this.getExportedName(typescriptModuleDeclaration);
		this.doWrite(typescriptModuleDeclaration);	
    }

    protected writeExportModule(fileName: string): void {
        fs.appendFileSync(
            fileName,
            "export = " + this.exportNamespace + ";\n\n"
        );
    }

    protected openNamespace(fileName: string): void {
        fs.appendFileSync(
            fileName,
            "declare namespace " + this.exportNamespace + " {\n"
        );
    }

    protected closeNamespace(fileName: string, typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        fs.appendFileSync(
            fileName,
            "}"
        );
    }

	protected getConstructorSignature(f: FunctionDeclaration) {
		let argumentsWithType = this.buildArgumentsWithType(f);

        return "constructor(" + argumentsWithType + ")";
    }

	protected getFunctionNameWithTypes(f: FunctionDeclaration) {
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

    protected buildArgumentsWithType(f: FunctionDeclaration): string[] {
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
                .map(this.getMapping())
                .join(" | ")}`;
        });
	}

    protected buildInterfaceAttribute(a: InterfaceAttributeDeclaration): string {
        let types = a.type;
        if (types.length > 1) {
            types = types.filter(t => t !== "undefined");
        }

        return `'${a.name}'${a.optional ? "?" : ""}: ${types.join(" | ")}`;
	}

	protected getMapping(): ((s: string) => string) {
		return (argumentType: string) => {
			let newType = argumentType;
			if (this.interfaceNames.indexOf(newType) !== -1) {
				if (this.exportNamespace !== "") {
					newType = this.exportNamespace + "." + newType;
				}
			}

			return newType;
		};
	}
}