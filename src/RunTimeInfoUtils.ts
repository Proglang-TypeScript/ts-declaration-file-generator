import * as fs from 'fs';

export interface FunctionRuntimeInfo {
    functionId: string,
    functionName: string,
    args: { [traceId: string]: ArgumentRuntimeInfo[]; },
    returnTypeOfs: { [traceId: string] : string },
    functionIid: number,
    requiredModule: string,
    isExported: boolean
}

export interface ArgumentRuntimeInfo {
    argumentIndex: number,
    argumentName: string,
    interactions: InteractionRuntimeInfo[]
}

export interface InteractionRuntimeInfo {
    code: string,
    typeof: string,
    returnTypeOf: string,
    field: string,
    followingInteractions?: InteractionRuntimeInfo[],
    traceId: string
}

export class RuntimeInfoReader {
    private fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    read(): { [id: string]: FunctionRuntimeInfo } {
        let jsonFile = fs.readFileSync(this.fileName);
        let runTimeInfo: { [id: string]: FunctionRuntimeInfo } = {};

        let jsonInfo = JSON.parse(jsonFile.toString());

        for(let functionId in jsonInfo) {
            let functionInfo : FunctionRuntimeInfo = jsonInfo[functionId];
            functionInfo.args = this.getArgumentsInfo(functionInfo);
            functionInfo.returnTypeOfs = this.getReturnTypeOfsByTraceId(jsonInfo[functionId]);

            runTimeInfo[functionId] = functionInfo;
        }

        return runTimeInfo;
    }
    
    private getArgumentsInfo(functionInfo: any): { [traceId: string]: ArgumentRuntimeInfo[]; } {
        let attributesAggregatedByTraceId = this.aggregateArgumentsByTraceId(functionInfo);
        
        let args : { [traceId: string]: ArgumentRuntimeInfo[]; } = {};
        for (let traceId in attributesAggregatedByTraceId) {
            if (!(traceId in args)) {
                args[traceId] = [];
            }

            for (let argumentIndex in attributesAggregatedByTraceId[traceId]) {
                args[traceId].push(attributesAggregatedByTraceId[traceId][argumentIndex]);
            }
        }

        return args;
    }
    
    private aggregateArgumentsByTraceId(functionInfo: any): { [traceId: string]: { [argumentIndex: string]: ArgumentRuntimeInfo } } {
        let attributesAggregatedByTraceId: {
            [traceId: string]: {
                [argumentIndex: string]: ArgumentRuntimeInfo
            }
        } = {};

        for (let argumentId in functionInfo.args) {
            let argumentInfo = functionInfo.args[argumentId];

            argumentInfo.interactions.forEach((interaction: any) => {
                if (!(interaction.traceId in attributesAggregatedByTraceId)) {
                    attributesAggregatedByTraceId[interaction.traceId] = {};
                }

                if (!(argumentId in attributesAggregatedByTraceId[interaction.traceId])) {
                    attributesAggregatedByTraceId[interaction.traceId][argumentId] = {
                        argumentIndex: argumentInfo.argumentIndex,
                        argumentName: argumentInfo.argumentName,
                        interactions: []
                    };
                }

                let argument = attributesAggregatedByTraceId[interaction.traceId][argumentId];
                argument.interactions.push(interaction);
            });
        }

        return attributesAggregatedByTraceId;
    }

    private getReturnTypeOfsByTraceId(functionInfo: any): { [traceId: string]: string; } {
        let returnTypeOfsInfo: { [traceId: string]: string } = {};
        functionInfo.returnTypeOfs.forEach((returnTypeOf: any) => {
            returnTypeOfsInfo[returnTypeOf.traceId] = returnTypeOf.typeOf;
        });

        return returnTypeOfsInfo;
    }
}