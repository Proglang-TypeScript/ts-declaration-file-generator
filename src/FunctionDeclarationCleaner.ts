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
		this.combineReturnValues();

		return this.functionDeclarations;
	}

	private combineReturnValues() {
		let uniqueDeclarationNameAndArguments: { [id: string]: FunctionDeclaration } = {};

		this.functionDeclarations.forEach(declaration => {
			let serializedDeclaration = declaration.name + "__" + JSON.stringify(declaration.arguments);

			if (!(serializedDeclaration in uniqueDeclarationNameAndArguments)) {
				uniqueDeclarationNameAndArguments[serializedDeclaration] = declaration;
			} else {
				let d = uniqueDeclarationNameAndArguments[serializedDeclaration];
				d.returnTypeOfs = d.returnTypeOfs.concat(
					declaration.returnTypeOfs
				);
			}
		});

		let declarationWithCombinedReturnValues : FunctionDeclaration[] = [];

		for (const serializedDeclaration in uniqueDeclarationNameAndArguments) {
			if (uniqueDeclarationNameAndArguments.hasOwnProperty(serializedDeclaration)) {
				declarationWithCombinedReturnValues.push(uniqueDeclarationNameAndArguments[serializedDeclaration]);
			}
		}

		this.functionDeclarations = declarationWithCombinedReturnValues;
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
}