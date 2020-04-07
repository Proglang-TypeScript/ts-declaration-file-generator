export class ArgumentDeclaration {
    index: number;
    name: string;
    private typeOfs: { [typeOf: string]: boolean };
    private hasUndefined: boolean;

    constructor(index: number, name: string) {
        this.index = index;
        this.name = name;
        this.typeOfs = {};
	this.hasUndefined = false;
    }

    addTypeOf(returnTypeOf: string) {
	if (returnTypeOf === "undefined") {
	    this.hasUndefined = true;
	} else {
            this.typeOfs[returnTypeOf] = true;
        }
    }

    getTypeOfs() : string[] {
        return Object.keys(this.typeOfs);
    }

    isOptional() : boolean {
        return this.hasUndefined;
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
