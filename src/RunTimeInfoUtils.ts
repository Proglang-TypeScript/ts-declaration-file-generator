import * as fs from 'fs';

export interface FunctionRuntimeInfo {
    functionId: string,
    functionName: string,
    args: ArgumentRuntimeInfo[],
    returnTypeOfs: string[],
    functionIid: number
}

export interface ArgumentRuntimeInfo {
    argumentIndex: number,
    argumentName: string,
    interactions: InteractionRuntimeInfo[]
}

interface InteractionRuntimeInfo {
    code: string,
    typeof: string,
    returnTypeOf: string
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