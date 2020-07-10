import { FunctionDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";

export class FunctionDeclarationCleaner {
	functionDeclarations: FunctionDeclaration[] = [];

	clean(functionDeclarations: FunctionDeclaration[]) : FunctionDeclaration[] {
		this.functionDeclarations = functionDeclarations;

		this.combineReturnValues();
		this.combineOptionalValue();

		return this.functionDeclarations;
	}

	private combineOptionalValue() {
		const functionsMapByName = new Map<string, FunctionDeclaration[]>();

		this.functionDeclarations.forEach(functionDeclaration => {
			const functionsInMap = functionsMapByName.get(functionDeclaration.name) || [];
			functionsInMap.push(functionDeclaration);
			functionsMapByName.set(functionDeclaration.name, functionsInMap);
		});

		Array.from(functionsMapByName.keys()).forEach(functionName => {
			functionsMapByName.get(functionName)?.forEach(functionDeclaration => {
				functionDeclaration.getArguments().forEach(argumentDeclaration => {
					if (argumentDeclaration.isOptional()) {
						functionsMapByName.get(functionName)?.forEach(f => {
							f.getArguments().filter(a => a.index === argumentDeclaration.index).forEach(a => a.makeOptional());
						});
					}
				});
			});
		});
	}

	private combineReturnValues() {
		let uniqueDeclarationNameAndArguments: { [id: string]: FunctionDeclaration } = {};

		this.functionDeclarations.forEach(declaration => {
			let serializedDeclaration = declaration.name + "__" + JSON.stringify(declaration.getArguments());

			if (!(serializedDeclaration in uniqueDeclarationNameAndArguments)) {
				uniqueDeclarationNameAndArguments[serializedDeclaration] = declaration;
			} else {
				let d = uniqueDeclarationNameAndArguments[serializedDeclaration];
				declaration.getReturnTypeOfs().forEach(returnTypeOf => {
					d.addReturnTypeOf(returnTypeOf);
				});
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
}