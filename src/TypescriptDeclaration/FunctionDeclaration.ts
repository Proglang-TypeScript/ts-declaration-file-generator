export class ArgumentDeclaration {
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
    return Array.from(this.typeOfs);
  }

  makeOptional() {
    this.addTypeOf('undefined');
    return this;
  }

  isOptional(): boolean {
    return this.typeOfs.has('undefined');
  }

  serialize(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: { [k: string]: any } = { ...this };
    a.typeOfs = this.getTypeOfs().sort();

    return JSON.stringify(a);
  }
}

export class FunctionDeclaration {
  name = '';
  isExported = false;
  private arguments: ArgumentDeclaration[] = [];
  private returnTypeOfs: { [typeOf: string]: boolean } = {};

  addArgument(a: ArgumentDeclaration) {
    this.arguments.push(a);
  }

  addReturnTypeOf(returnTypeOf: string) {
    if (!(returnTypeOf in this.returnTypeOfs)) {
      this.returnTypeOfs[returnTypeOf] = true;
    }
  }

  getReturnTypeOfs(): string[] {
    return Object.keys(this.returnTypeOfs);
  }

  getArguments(): ArgumentDeclaration[] {
    return this.arguments;
  }
}
