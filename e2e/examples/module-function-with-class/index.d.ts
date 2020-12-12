export = ModuleFunctionWithClass;
declare function ModuleFunctionWithClass(someNumber: number): number;
declare namespace ModuleFunctionWithClass {
  export class ModuleFunctionWithClass {
    constructor(name: string);
    doSomething(): string;
  }
}
