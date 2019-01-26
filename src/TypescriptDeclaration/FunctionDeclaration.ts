export class ArgumentDeclaration {
    index: number;
    name: string;
    typeOfs: string[];

    constructor(index: number, name: string) {
        this.index = index;
        this.name = name;
        this.typeOfs = [];
    }
}

export class FunctionDeclaration {
    name: string = "";
    returnTypeOfs: string[] = [];
    arguments: ArgumentDeclaration[] = [];

    addArgument(a: ArgumentDeclaration) {
        this.arguments.push(a);
    }
}