import { FunctionDeclaration } from './FunctionDeclaration';

export interface InterfaceAttributeDeclaration {
  name: string;
  getTypeOfs(): string[];
  isOptional(): boolean;
}

export class InterfaceDeclaration {
  name = '';
  methods: FunctionDeclaration[] = [];
  private attributes = new Map<string, string[]>();

  mergeWith(i: InterfaceDeclaration): void {
    i.getAttributes().forEach((a) => {
      this.addAttribute(a.name, a.getTypeOfs());
    });
  }

  addAttribute(name: string, types: string[]): void {
    const alreadyAddedTypesForThisName = this.attributes.get(name) || [];

    this.attributes.set(name, this.removeDuplicates(alreadyAddedTypesForThisName.concat(types)));
  }

  private removeDuplicates(target: string[]): string[] {
    return Array.from(new Set(target));
  }

  getAttributes(): InterfaceAttributeDeclaration[] {
    return Array.from(this.attributes.keys()).map((name) => {
      const typeOfs = this.attributes.get(name) || [];
      return {
        name,
        getTypeOfs: () => typeOfs,
        isOptional: () => typeOfs.includes('undefined'),
      };
    });
  }

  getAttributesNames(): string[] {
    return Array.from(this.attributes.keys());
  }
}
