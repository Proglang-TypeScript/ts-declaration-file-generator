import ArgumentDeclaration from './ArgumentDeclaration';

export class FunctionDeclaration {
  name = '';
  isExported = false;
  private arguments: ArgumentDeclaration[] = [];
  private returnTypeOfs = new Set<string>();

  addArgument(a: ArgumentDeclaration) {
    this.arguments.push(a);
  }

  addReturnTypeOf(returnTypeOf: string) {
    this.returnTypeOfs.add(returnTypeOf);
  }

  getReturnTypeOfs(): string[] {
    return Array.from(this.returnTypeOfs);
  }

  getArguments(): ArgumentDeclaration[] {
    return this.arguments;
  }
}
