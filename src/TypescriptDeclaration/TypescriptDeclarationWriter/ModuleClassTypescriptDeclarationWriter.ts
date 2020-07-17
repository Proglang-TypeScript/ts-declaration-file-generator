import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseModuleTypescriptDeclaration } from '../ModuleDeclaration/BaseModuleTypescriptDeclaration';

export class ModuleClassTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
    protected doWrite(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration) {
		this.writeExportModule();
		this.writeClass(typescriptModuleDeclaration);
		this.openNamespace();
        this.writeInterfaces(typescriptModuleDeclaration);
		this.writeFunctions(typescriptModuleDeclaration);
		this.closeNamespace();
    }

	protected getExportedName(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): string {
		return typescriptModuleDeclaration.classes[0].name
	}

	private writeClass(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
		let classDeclaration = typescriptModuleDeclaration.classes[0];

		this.fileContents += "declare class " + classDeclaration.name + " {\n";
		this.fileContents += "\t" + this.getConstructorSignature(classDeclaration.constructorMethod) + ";\n";

		classDeclaration.getMethods().forEach(m => {
			this.fileContents += "\t" + this.getFunctionNameWithTypes(m) + ";\n";
		});

		this.fileContents += "}\n\n";
	}

    private writeInterfaces(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
        typescriptModuleDeclaration.interfaces.forEach(i => {
			this.fileContents += "\texport interface " + i.name + " {\n";

            i.getAttributes().forEach(a => {
				this.fileContents += `\t\t${this.buildInterfaceAttribute(a)};\n`;
            });

			i.methods.forEach(m => {
                this.fileContents += "\t\t" + this.getFunctionNameWithTypes(m) + ";\n";
            });

            this.fileContents += "\t}\n\n";
        });
    }

    private writeFunctions(typescriptModuleDeclaration: BaseModuleTypescriptDeclaration): void {
		typescriptModuleDeclaration.methods.forEach(functionDeclaration => {
            this.fileContents += "export function " + this.getFunctionNameWithTypes(functionDeclaration) + ";\n";
        });
	}
}