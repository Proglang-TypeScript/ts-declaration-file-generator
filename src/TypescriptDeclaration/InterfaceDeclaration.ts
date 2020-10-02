import { FunctionDeclaration } from './FunctionDeclaration';

export interface InterfaceAttributeDeclaration {
  name: string;
  type: string[];
  optional?: boolean;
}

export class InterfaceDeclaration {
  name = '';
  methods: FunctionDeclaration[] = [];
  private attributes = new Map<string, string[]>();

  concatWith(i: InterfaceDeclaration): void {
    i.getAttributes().forEach((a) => {
      this.addAttribute(a);
    });
  }

  addAttribute(attributeDeclaration: InterfaceAttributeDeclaration): void {
    const alreadyAddedTypesForThisName = this.attributes.get(attributeDeclaration.name) || [];

    this.attributes.set(
      attributeDeclaration.name,
      this.removeDuplicates(alreadyAddedTypesForThisName.concat(attributeDeclaration.type)),
    );
  }

  private removeDuplicates(target: string[]): string[] {
    return Array.from(new Set(target));
  }

  getAttributes(): InterfaceAttributeDeclaration[] {
    return Array.from(this.attributes.keys()).map((name) => {
      return {
        name,
        type: this.attributes.get(name) || [],
        optional: (this.attributes.get(name) || []).indexOf('undefined') > -1,
      };
    });
  }

  getAttributesNames(): string[] {
    return Array.from(this.attributes.keys());
  }
}
