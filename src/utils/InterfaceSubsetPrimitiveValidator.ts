import { InterfaceDeclaration } from "../TypescriptDeclaration/InterfaceDeclaration";

export class InterfaceSubsetPrimitiveValidator {
	private STRING_ATTRIBUTES = ['length'];

	isInterfaceSubsetOfString(i: InterfaceDeclaration): boolean {
		return i.getAttributes().filter(
			(a) => this.STRING_ATTRIBUTES.includes(a.name)
		).length > 0;
	}
}