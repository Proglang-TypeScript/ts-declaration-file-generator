import { InterfaceDeclaration } from '../TypescriptDeclaration/InterfaceDeclaration';

export class InterfaceSubsetPrimitiveValidator {
  private STRING_ATTRIBUTES = ['length'];

  isInterfaceSubsetOfString(i: InterfaceDeclaration): boolean {
    const attributes = i.getAttributes();

    if (attributes.length === 0) return false;

    return i.getAttributes().filter((a) => !this.isStringAttribute(a.name)).length === 0;
  }

  private isStringAttribute(attribute: string) {
    return this.STRING_ATTRIBUTES.includes(attribute) || !isNaN(+attribute);
  }
}
