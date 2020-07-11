import fs from 'fs';
import { ModuleClassTypescriptDeclaration } from '../ModuleDeclaration/ModuleClassTypescriptDeclaration';
import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export class ModuleClassTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
    protected doWrite(typescriptModuleDeclaration: ModuleClassTypescriptDeclaration) {
		this.writeExportModule(this.fileName);
		this.writeClass(this.fileName, typescriptModuleDeclaration);
		this.openNamespace(this.fileName);
        this.writeInterfaces(this.fileName, typescriptModuleDeclaration);
		this.writeFunctions(this.fileName, typescriptModuleDeclaration);
		this.closeNamespace(this.fileName, typescriptModuleDeclaration);
    }

	protected getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string {
		return typescriptModuleDeclaration.classes[0].name
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
}