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