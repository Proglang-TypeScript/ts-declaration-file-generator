import * as fs from 'fs';
import { FunctionDeclaration } from "../FunctionDeclaration";
import { ModuleClassTypescriptDeclaration } from '../ModuleDeclaration/ModuleClassTypescriptDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';

export class ModuleClassTypescriptDeclarationWriter {
	interfaceNames: string[];

	constructor() {
		this.interfaceNames = [];
	}

    write(typescriptModuleDeclaration: ModuleClassTypescriptDeclaration, outputDirectory: string) {
		this.interfaceNames = typescriptModuleDeclaration.interfaces.map(i => {
			return i.name;
		});
		
		let filePath = outputDirectory + "/" + typescriptModuleDeclaration.module;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);

		this.writeExportModule(fileName, typescriptModuleDeclaration);
		this.writeClass(fileName, typescriptModuleDeclaration);
		this.openNamespace(fileName, typescriptModuleDeclaration);
        this.writeInterfaces(fileName, typescriptModuleDeclaration);
		this.writeFunctions(fileName, typescriptModuleDeclaration);
		this.closeNamespace(fileName, typescriptModuleDeclaration);
    }

	private writeExportModule(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
		fs.appendFileSync(
			fileName,
			"export = " + typescriptModuleDeclaration.classes[0].name + ";\n\n"
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
			"\t" + this.getConstructorSignature(classDeclaration) + ";\n"
		);

		classDeclaration.getMethods().forEach(m => {
			fs.appendFileSync(
				fileName,
				"\t" + this.getClassMethod(m) + ";\n"
			);
		});

		fs.appendFileSync(
			fileName,
			"}\n\n"
		);
	}

	private openNamespace(fileName: string, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration): void {
		let classDeclaration = typescriptModuleDeclaration.classes[0];

		fs.appendFileSync(
			fileName,
			"declare namespace " + classDeclaration.name + " {\n"
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
	    	let colon = a.optional ? "?: " : ": ";
                fs.appendFileSync(
                    fileName,
                    "\t\t'" + a.name + "'" + colon + a.type + ";\n"
                ); 
            });

            i.methods.forEach(m => {
                fs.appendFileSync(
                    fileName,
                    "\t\t" + this.getFunctionNameWithTypes(m, typescriptModuleDeclaration) + ";\n"
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
                "export function " + this.getFunctionNameWithTypes(functionDeclaration, typescriptModuleDeclaration) + ";\n"
            );
        });
	}

	private getClassMethod(f: FunctionDeclaration) {
		var optional = false;
		let argumentsWithType = f.getArguments().map(argument => {
		    	optional = argument.isOptional() || optional;
			let colon = optional ? "?: " : ": ";
			return argument.name + colon + argument.getTypeOfs().join("|");
		}).join(", ");

		return f.name + "(" + argumentsWithType + "): " + f.getReturnTypeOfs().join("|");
	}

    private getFunctionNameWithTypes(f: FunctionDeclaration, typescriptModuleDeclaration: ModuleClassTypescriptDeclaration) {
		let classDeclaration = typescriptModuleDeclaration.classes[0];
		var optional = false;
		let argumentsWithType = f.getArguments().map(argument => {
		        optional = argument.isOptional() || optional;
			let colon = optional ? "?: " : ": ";
			return argument.name + colon + argument.getTypeOfs().map(this.mapArgumenTypeToClassNamespace(classDeclaration.name)).join("|");
        }).join(", ");

        return f.name + "(" + argumentsWithType + "): " + f.getReturnTypeOfs().join("|");
    }

	private getConstructorSignature(classDeclaration: ClassDeclaration) {
		let f = classDeclaration.constructorMethod;
		var optional = false;
		let argumentsWithType = f.getArguments().map(argument => {
		    	optional = argument.isOptional() || optional;
			let colon = optional ? "?: " : ": ";
			return argument.name + colon + argument.getTypeOfs().map(this.mapArgumenTypeToClassNamespace(classDeclaration.name)).join("|");
		}).join(", ");

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
	
	private mapArgumenTypeToClassNamespace(nameOfClass: string) {
		return (argumentType: string) => {
			let newType = argumentType;
			if (this.interfaceNames.indexOf(newType) !== -1) {
				newType = nameOfClass + "." + newType;
			}

			return newType;
		};
	}
}