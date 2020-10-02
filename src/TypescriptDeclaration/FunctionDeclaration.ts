import ArgumentDeclaration from './ArgumentDeclaration';

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
