import { InterfaceDeclaration } from '../InterfaceDeclaration';

export class InterfaceSubsetPrimitiveValidator {
  private STRING_ATTRIBUTES = ['length'];
  private ARRAY_ATTRIBUTES = ['length', 'forEach', 'map', 'indexOf'];

  isInterfaceSubsetOfString(i: InterfaceDeclaration): boolean {
    const attributes = i.getAttributes();

    if (attributes.length === 0) return false;

    return i.getAttributes().filter((a) => !this.isStringAttribute(a.name)).length === 0;
  }

  public isStringAttribute(attribute: string) {
    return this.STRING_ATTRIBUTES.includes(attribute) || !isNaN(+attribute);
  }

  isInterfaceSubsetOfArray(i: InterfaceDeclaration): boolean {
    const attributes = i.getAttributes();

    if (attributes.length === 0) return false;

    return i.getAttributes().filter((a) => !this.isArrayAttribute(a.name)).length === 0;
  }

  public isArrayAttribute(attribute: string) {
    return this.ARRAY_ATTRIBUTES.includes(attribute) || this.isArrayElement(attribute);
  }

  public isArrayElement(attribute: string) {
    return !isNaN(+attribute);
  }
}
