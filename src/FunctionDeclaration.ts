export interface ArgumentDeclaration {
    index: number,
    name: string,
    differentTypeOfs: string[]
}

export class FunctionDeclaration {
    name: string = "";
    differentReturnTypeOfs: string[] = [];
    arguments: ArgumentDeclaration[] = [];

    addArgument(a: ArgumentDeclaration) {
        this.arguments.push(a);
    }
}