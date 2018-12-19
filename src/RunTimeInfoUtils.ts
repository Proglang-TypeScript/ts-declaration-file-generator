import * as fs from 'fs';
import * as FunctionDeclaration from "./FunctionDeclaration";

export interface FunctionRuntimeInfo {
    functionId: string,
    functionName: string,
    args: ArgumentRuntimeInfo[],
    returnTypeOfs: string[],
    functionIid: number
}

interface ArgumentRuntimeInfo {
    argumentIndex: number,
    argumentName: string,
    interactions: InteractionRuntimeInfo[]
}

interface InteractionRuntimeInfo {
    code: string,
    typeof: string
}

export class RunTimeInfo {
    info: { [id: string] : FunctionRuntimeInfo; } = {};
};

export class RuntimeInfoReader {
    read(fileName: string) : RunTimeInfo {
        let jsonFile = fs.readFileSync(fileName);
        let runTimeInfo = new RunTimeInfo();

        let jsonInfo = JSON.parse(jsonFile.toString());

        for(let functionId in jsonInfo) {
            let functionInfo : FunctionRuntimeInfo;

            functionInfo = jsonInfo[functionId];

            let returnTypeOfsWithoutDuplicates: string[] = [];
            let differentReturnTypeOfs : { [id: string] : boolean; } = {};
            functionInfo.returnTypeOfs.forEach(returnTypeOf => {
                if (!(returnTypeOf in differentReturnTypeOfs)) {
                    differentReturnTypeOfs[returnTypeOf] = true;
                    returnTypeOfsWithoutDuplicates.push(returnTypeOf);
                }
            });
            functionInfo.returnTypeOfs = returnTypeOfsWithoutDuplicates;

            let args : ArgumentRuntimeInfo[] = [];

            for(let argumentId in jsonInfo[functionId].args) {
                args.push(jsonInfo[functionId].args[argumentId]);
            }

            functionInfo.args = args;
            runTimeInfo.info[functionId]= functionInfo;
        }

        return runTimeInfo;
    }
}

export class FunctionDeclarationBuilder {
    build(functionRunTimeInfo: FunctionRuntimeInfo) : FunctionDeclaration.FunctionDeclaration {
        let functionDeclaration = new FunctionDeclaration.FunctionDeclaration();
        functionDeclaration.name = functionRunTimeInfo.functionName;
        functionDeclaration.differentReturnTypeOfs = functionRunTimeInfo.returnTypeOfs;
    
        functionRunTimeInfo.args.forEach(argument => {
            let argumentDeclaration : FunctionDeclaration.ArgumentDeclaration = {
                index: argument.argumentIndex,
                name: argument.argumentName,
                differentTypeOfs: []
            };
    
            let differentReturnTypeOfs : { [id: string] : boolean; } = {};
            argument.interactions.forEach(interaction => {
                if (interaction.code === "inputValue") {
                    if (!(interaction.typeof in differentReturnTypeOfs)) {
                        differentReturnTypeOfs[interaction.typeof] = true;
                        argumentDeclaration.differentTypeOfs.push(interaction.typeof);
                    }
                }
            });
    
            functionDeclaration.addArgument(argumentDeclaration);
        });

        return functionDeclaration;
    } 
}