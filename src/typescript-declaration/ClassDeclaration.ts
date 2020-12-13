import { FunctionDeclaration } from './FunctionDeclaration';

export class ClassDeclaration {
  name = '';
  constructorMethod: FunctionDeclaration = new FunctionDeclaration();
  methods: FunctionDeclaration[] = [];

  setConstructor(constructor: FunctionDeclaration): void {
    this.name = constructor.name;
    this.constructorMethod = constructor;
  }

  addMethod(method: FunctionDeclaration): void {
    this.methods.push(method);
  }

  getMethods(): FunctionDeclaration[] {
    return this.methods;
  }
}
