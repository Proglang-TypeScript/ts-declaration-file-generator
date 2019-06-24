export class ArgumentDeclaration {
    index: number;
    name: string;
    private typeOfs: { [typeOf: string]: boolean };

    constructor(index: number, name: string) {
        this.index = index;
        this.name = name;
        this.typeOfs = {};
    }

    addTypeOf(returnTypeOf: string) {
        if (!(returnTypeOf in this.typeOfs)) {
            this.typeOfs[returnTypeOf] = true;
        }
    }

    getTypeOfs() : string[] {
        return Object.keys(this.typeOfs);
    }
}

export class FunctionDeclaration {
    name: string = "";
    isExported: boolean = false;
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