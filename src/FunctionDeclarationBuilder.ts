import * as FunctionDeclaration from "./TypescriptDeclaration/FunctionDeclaration";
import { FunctionRuntimeInfo, ArgumentRuntimeInfo } from "./RunTimeInfoUtils";
import { InterfaceDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationBuilder {
    interfaceDeclarations: InterfaceDeclaration[];

    constructor() {
        this.interfaceDeclarations = [];
    };

    build(functionRunTimeInfo: FunctionRuntimeInfo) : FunctionDeclaration.FunctionDeclaration {
        let functionDeclaration = new FunctionDeclaration.FunctionDeclaration();
        functionDeclaration.name = functionRunTimeInfo.functionName;
        functionDeclaration.differentReturnTypeOfs = this.getDifferentReturnTypeOfs(functionRunTimeInfo);
    
        functionRunTimeInfo.args.forEach(argument => {
            let interfaceDeclaration = new InterfaceDeclaration();
            interfaceDeclaration.name = "Interface__" + argument.argumentName + "__" + Math.ceil(Math.random()*1000);

            argument.interactions.forEach(interaction => {
                if (interaction.code === "getField") {
                    if (interfaceDeclaration) {
                        interfaceDeclaration.addAttribute({
                            name: interaction.field,
                            type: interaction.returnTypeOf
                        });
                    }
                }
            });

            let differentReturnTypeOfs = this.getDifferentInputTypeOfs(argument);

            if (interfaceDeclaration.getAttributes().length > 0) {
                this.interfaceDeclarations.push(interfaceDeclaration);
                differentReturnTypeOfs.push(interfaceDeclaration.name);
                differentReturnTypeOfs = this.removeTypeOfObjectWhenItHasAnInterface(differentReturnTypeOfs);
            }

            let argumentDeclaration : FunctionDeclaration.ArgumentDeclaration = {
                index: argument.argumentIndex,
                name: argument.argumentName,
                differentTypeOfs: differentReturnTypeOfs
            };
    
            functionDeclaration.addArgument(argumentDeclaration);
        });

        return functionDeclaration;
    }
    
    private removeTypeOfObjectWhenItHasAnInterface(differentReturnTypeOfs: string[]): string[] {
        return differentReturnTypeOfs.filter((val) => {
            return val !== "object";
        });
    }

    private getDifferentInputTypeOfs(argument: ArgumentRuntimeInfo): string[] {
        let matchedReturnTypeOfs: string[] = argument.interactions.filter(
            interaction => {
                return (interaction.code === "inputValue");
            }
        ).map(interaction => {
            return this.matchToTypescriptType(interaction.typeof);
        });

        return this.removeDuplicates(matchedReturnTypeOfs);
    }

    private getDifferentReturnTypeOfs(functionRunTimeInfo: FunctionRuntimeInfo) : string[] {
        let matchedReturnTypeOfs: string[] = functionRunTimeInfo.returnTypeOfs.map(returnTypeOf => {
            return this.matchToTypescriptType(returnTypeOf);
        });

        return this.removeDuplicates(matchedReturnTypeOfs);
    }

    private matchToTypescriptType(t: string): string {
        let m: { [id: string] : string; } = {
            "string": "string",
            "number": "number",
            "undefined": "undefined",
            "null": "null",
            "object": "object",
            "array": "Array<any>",
            "boolean": "boolean",
            "function": "Function",
        };

        if (!(t in m)) {
            return t;
        }

        return m[t];
    }

    private removeDuplicates(target: string[]) : string[] {
        let different : { [id: string] : boolean; } = {};
        target.forEach(i => {
            if (!(i in different)) {
                different[i] = true;
            }
        });

        return Object.keys(different);
    }
}