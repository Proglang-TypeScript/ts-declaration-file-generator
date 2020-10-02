import fs from 'fs';
import { FunctionRuntimeInfo, ArgumentRuntimeInfo } from './types';

export class RuntimeInfoParser {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  parse(): { [id: string]: FunctionRuntimeInfo } {
    const jsonFile = fs.readFileSync(this.fileName);
    const runTimeInfo: { [id: string]: FunctionRuntimeInfo } = {};

    const jsonInfo = JSON.parse(jsonFile.toString());

    for (const functionId in jsonInfo) {
      const functionInfo: FunctionRuntimeInfo = jsonInfo[functionId];
      functionInfo.args = this.getArgumentsInfo(functionInfo);
      functionInfo.returnTypeOfs = this.getReturnTypeOfsByTraceId(jsonInfo[functionId]);

      runTimeInfo[functionId] = functionInfo;
    }

    return runTimeInfo;
  }

  private getArgumentsInfo(
    functionInfo: FunctionRuntimeInfo,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionInfo: any,
  ): { [traceId: string]: { [argumentIndex: string]: ArgumentRuntimeInfo } } {
    const attributesAggregatedByTraceId: {
      [traceId: string]: {
        [argumentIndex: string]: ArgumentRuntimeInfo;
      };
    } = {};

    for (const argumentId in functionInfo.args) {
      const argumentInfo = functionInfo.args[argumentId];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      argumentInfo.interactions.forEach((interaction: any) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getReturnTypeOfsByTraceId(functionInfo: any): { [traceId: string]: string } {
    const returnTypeOfsInfo: { [traceId: string]: string } = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionInfo.returnTypeOfs.forEach((returnTypeOf: any) => {
      returnTypeOfsInfo[returnTypeOf.traceId] = returnTypeOf.typeOf;
    });

    return returnTypeOfsInfo;
  }
}
