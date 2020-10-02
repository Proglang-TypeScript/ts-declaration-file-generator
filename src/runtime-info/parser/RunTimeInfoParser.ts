import fs from 'fs';
import { FunctionRuntimeInfo, ArgumentRuntimeInfo } from './parsedTypes';
import { JsonRuntimeInfo, JsonFunctionContainer } from './inputTypes';

export class RuntimeInfoParser {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  parse(): { [id: string]: FunctionRuntimeInfo } {
    const jsonFile = fs.readFileSync(this.fileName);
    const runTimeInfo: { [id: string]: FunctionRuntimeInfo } = {};

    const jsonInfo = JSON.parse(jsonFile.toString()) as JsonRuntimeInfo;

    for (const functionId in jsonInfo) {
      const jsonFunctionContainer: JsonFunctionContainer = jsonInfo[functionId];

      const functionInfo: FunctionRuntimeInfo = {
        ...jsonFunctionContainer,
        args: this.getArgumentsInfo(jsonFunctionContainer),
        returnTypeOfs: this.getReturnTypeOfsByTraceId(jsonFunctionContainer),
      };

      runTimeInfo[functionId] = functionInfo;
    }

    return runTimeInfo;
  }

  private getArgumentsInfo(
    functionInfo: JsonFunctionContainer,
  ): { [traceId: string]: ArgumentRuntimeInfo[] } {
    const attributesAggregatedByTraceId = this.aggregateArgumentsByTraceId(functionInfo);

    const args: { [traceId: string]: ArgumentRuntimeInfo[] } = {};
    for (const traceId in attributesAggregatedByTraceId) {
      if (!(traceId in args)) {
        args[traceId] = [];
      }

      for (const argumentIndex in attributesAggregatedByTraceId[traceId]) {
        args[traceId].push(attributesAggregatedByTraceId[traceId][argumentIndex]);
      }
    }

    return args;
  }

  private aggregateArgumentsByTraceId(
    functionInfo: JsonFunctionContainer,
  ): { [traceId: string]: { [argumentIndex: string]: ArgumentRuntimeInfo } } {
    const attributesAggregatedByTraceId: {
      [traceId: string]: {
        [argumentIndex: string]: ArgumentRuntimeInfo;
      };
    } = {};

    for (const argumentId in functionInfo.args) {
      const argumentInfo = functionInfo.args[argumentId];

      argumentInfo.interactions.forEach((interaction) => {
        if (!(interaction.traceId in attributesAggregatedByTraceId)) {
          attributesAggregatedByTraceId[interaction.traceId] = {};
        }

        if (!(argumentId in attributesAggregatedByTraceId[interaction.traceId])) {
          attributesAggregatedByTraceId[interaction.traceId][argumentId] = {
            argumentIndex: argumentInfo.argumentIndex,
            argumentName: argumentInfo.argumentName,
            interactions: [],
          };
        }

        const argument = attributesAggregatedByTraceId[interaction.traceId][argumentId];
        argument.interactions.push(interaction);
      });
    }

    return attributesAggregatedByTraceId;
  }

  private getReturnTypeOfsByTraceId(
    functionInfo: JsonFunctionContainer,
  ): { [traceId: string]: string } {
    const returnTypeOfsInfo: { [traceId: string]: string } = {};
    functionInfo.returnTypeOfs.forEach((returnTypeOf) => {
      returnTypeOfsInfo[returnTypeOf.traceId] = returnTypeOf.typeOf;
    });

    return returnTypeOfsInfo;
  }
}
