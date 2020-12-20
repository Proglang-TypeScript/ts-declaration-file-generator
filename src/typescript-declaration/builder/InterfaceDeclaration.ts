import { FunctionDeclaration } from './FunctionDeclaration';
import { DTSType, DTSTypeKeywords } from '../ast/types/dtsType';
import objectHash from 'object-hash';

export interface InterfaceAttributeDeclaration {
  name: string;
  getTypeOfs(): DTSType[];
  isOptional(): boolean;
}

export class InterfaceDeclaration {
  name = '';
  methods: FunctionDeclaration[] = [];
  private attributes = new Map<string, DTSType[]>();

  mergeWith(i: InterfaceDeclaration): void {
    i.getAttributes().forEach((a) => {
      this.addAttribute(a.name, a.getTypeOfs());
    });
  }

  addAttribute(name: string, types: DTSType[]): void {
    const alreadyAddedTypesForThisName = this.attributes.get(name) || [];

    this.attributes.set(name, this.removeDuplicates(alreadyAddedTypesForThisName.concat(types)));
  }

  private removeDuplicates(target: DTSType[]): DTSType[] {
    const map = new Map<string, DTSType>();
    target.forEach((t) => map.set(objectHash(t), t));

    return Array.from(map.values());
  }

  getAttributes(): InterfaceAttributeDeclaration[] {
    return Array.from(this.attributes.keys()).map((name) => {
      const typeOfs = this.attributes.get(name) || [];
      return {
        name,
        getTypeOfs: () => typeOfs,
        isOptional: () => typeOfs.some((t) => t.value === DTSTypeKeywords.UNDEFINED),
      };
    });
  }

  getAttributesNames(): string[] {
    return Array.from(this.attributes.keys());
  }
}
