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

  mergeWith(i: InterfaceDeclaration): void {
    i.getAttributes().forEach((a) => {
      this.addAttribute(a.name, a.type);
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
