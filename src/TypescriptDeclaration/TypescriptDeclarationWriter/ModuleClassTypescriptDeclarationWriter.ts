import fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleClassTypescriptDeclaration } from '../ModuleDeclaration/ModuleClassTypescriptDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { InterfaceAttributeDeclaration } from '../InterfaceDeclaration';

export class ModuleClassTypescriptDeclarationWriter {
	interfaceNames: string[];
	private exportNamespace: string;

	constructor() {
		this.interfaceNames = [];
		this.exportNamespace = "";
	}

    write(typescriptModuleDeclaration: ModuleClassTypescriptDeclaration, outputDirectory: string) {
		this.interfaceNames = typescriptModuleDeclaration.interfaces.map(i => {
			return i.name;
		});
		
		let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);

		this.exportNamespace = typescriptModuleDeclaration.classes[0].name;

		this.writeExportModule(fileName);
		this.writeClass(fileName, typescriptModuleDeclaration);
		this.openNamespace(fileName);
        this.writeInterfaces(fileName, typescriptModuleDeclaration);
		this.writeFunctions(fileName, typescriptModuleDeclaration);
		this.closeNamespace(fileName, typescriptModuleDeclaration);
    }

	private writeExportModule(fileName: string): void {
		fs.appendFileSync(
			fileName,
			"export = " + this.exportNamespace + ";\n\n"
		);
	}

	private writeClass(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
		let classDeclaration = typescriptModuleDeclaration.classes[0];
		
		fs.appendFileSync(
			fileName,
			"declare class " + classDeclaration.name + " {\n"
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
	}

	private openNamespace(fileName: string): void {
		fs.appendFileSync(
			fileName,
			"declare namespace " + this.exportNamespace + " {\n"
		);
	}

	private closeNamespace(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
		fs.appendFileSync(
			fileName,
			"}"
		);
	}

    private writeInterfaces(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
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

    private writeFunctions(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
		typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            fs.appendFileSync(
                fileName,
                "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n"
            );
        });
	}

    private getFunctionNameWithTypes(f: FunctionDeclaration) {
		let argumentsWithType = this.buildArgumentsWithType(f, this.mapArgumenTypeToNamespace(this.exportNamespace));

		return `${f.name}(${argumentsWithType.join(", ")}): ${f.getReturnTypeOfs().join(" | ")}`;
    }

	private getConstructorSignature(f: FunctionDeclaration) {
		let argumentsWithType = this.buildArgumentsWithType(f, this.mapArgumenTypeToNamespace(this.exportNamespace));

		return "constructor(" + argumentsWithType + ")";
	}

    private cleanOutput(filePath: string, fileName: string) : void {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
	}
	
	private mapArgumenTypeToNamespace(nameOfClass: string) {
		return (argumentType: string) => {
			let newType = argumentType;
			if (this.interfaceNames.indexOf(newType) !== -1) {
				newType = nameOfClass + "." + newType;
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