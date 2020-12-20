import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../ast/types';
import hash from 'object-hash';
import objectHash from 'object-hash';

export interface PropertyDeclaration {
  name: string;
  isOptional(): boolean;
  getTypeOfs(): DTSType[];
}

const UNDEFINED_TYPE: DTSType = { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.UNDEFINED };

export default class ArgumentDeclaration implements PropertyDeclaration {
  private typeOfs = new Map<string, DTSType>();

  constructor(public index: number, public name: string) {}

  addTypeOf(typeOf: DTSType) {
    this.typeOfs.set(hash(typeOf), typeOf);
    return this;
  }

  getTypeOfs(): DTSType[] {
    return Array.from(this.typeOfs.values()).sort((a, b) => {
      const [hashA, hashB] = [hash(a), hash(b)];

      if (hashA < hashB) {
        return -1;
      }

      if (hashA > hashB) {
        return 1;
      }

      return 0;
    });
  }

  makeOptional() {
    this.addTypeOf(UNDEFINED_TYPE);
    return this;
  }

  isOptional(): boolean {
    return this.typeOfs.has(hash(UNDEFINED_TYPE));
  }

  serialize(): string {
    return objectHash(
      JSON.stringify({
        ...this,
        typeOfs: this.getTypeOfs(),
      }),
    );
  }
}
