import { FunctionDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import { InterfaceDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationCleaner {
	functionDeclarations: FunctionDeclaration[];
	interfaceDeclarations: { [id: string]: InterfaceDeclaration; };

	constructor(
		functionDeclarations: FunctionDeclaration[],
		interfaceDeclarations: { [id: string]: InterfaceDeclaration; }
	) {
		this.functionDeclarations = functionDeclarations;
		this.interfaceDeclarations = interfaceDeclarations;
	}

	clean() : FunctionDeclaration[] {
		this.removeDuplicatedDeclarations();

		return this.functionDeclarations;
	}

	private removeDuplicatedDeclarations() {
		let uniqueDeclarations: { [id: string]: boolean } = {};

		this.functionDeclarations = this.functionDeclarations.filter(declaration => {
			let serialized = JSON.stringify(declaration);

			if (!(serialized in uniqueDeclarations)) {
				uniqueDeclarations[serialized] = true;
				return true;
			} else {
				false;
			}
		});
	}

	private groupByName(functionDeclarations: FunctionDeclaration[]): { [id: string]: FunctionDeclaration[]; } {
		let functionDeclarationsGroupedByName: { [id: string]: FunctionDeclaration[]; } = {};

		functionDeclarations.forEach(functionDeclaration => {
			if (!(functionDeclaration.name in functionDeclarationsGroupedByName)) {
				functionDeclarationsGroupedByName[functionDeclaration.name] = [];
			}

			functionDeclarationsGroupedByName[functionDeclaration.name].push(functionDeclaration);
		});

		return functionDeclarationsGroupedByName;
	}
}