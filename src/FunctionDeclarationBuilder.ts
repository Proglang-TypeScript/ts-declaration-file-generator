import * as FunctionDeclaration from "./TypescriptDeclaration/FunctionDeclaration";
import { FunctionRuntimeInfo, ArgumentRuntimeInfo } from "./RunTimeInfoUtils";

export class FunctionDeclarationBuilder {
    build(functionRunTimeInfo: FunctionRuntimeInfo) : FunctionDeclaration.FunctionDeclaration {
        let functionDeclaration = new FunctionDeclaration.FunctionDeclaration();
        functionDeclaration.name = functionRunTimeInfo.functionName;
        functionDeclaration.differentReturnTypeOfs = this.getDifferentReturnTypeOfs(functionRunTimeInfo);
    
        functionRunTimeInfo.args.forEach(argument => {
            let argumentDeclaration : FunctionDeclaration.ArgumentDeclaration = {
                index: argument.argumentIndex,
                name: argument.argumentName,
                differentTypeOfs: this.getDifferentInputTypeOfs(argument)
            };
    
            functionDeclaration.addArgument(argumentDeclaration);
        });

        return functionDeclaration;
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