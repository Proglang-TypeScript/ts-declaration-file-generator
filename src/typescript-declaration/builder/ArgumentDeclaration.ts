export interface PropertyDeclaration {
  name: string;
  isOptional(): boolean;
  getTypeOfs(): string[];
}

export default class ArgumentDeclaration implements PropertyDeclaration {
  index: number;
  name: string;
  private typeOfs: Set<string>;

  constructor(index: number, name: string) {
    this.index = index;
    this.name = name;
    this.typeOfs = new Set<string>();
  }

  addTypeOf(typeOf: string) {
    this.typeOfs.add(typeOf);
    return this;
  }

  getTypeOfs(): string[] {
    return Array.from(this.typeOfs).sort();
  }

  makeOptional() {
    this.addTypeOf('undefined');
    return this;
  }

  isOptional(): boolean {
    return this.typeOfs.has('undefined');
  }

  serialize(): string {
    return JSON.stringify({
      ...this,
      typeOfs: this.getTypeOfs(),
    });
  }
}
