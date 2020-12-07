import fs from 'fs';
import { FunctionRuntimeInfo, ArgumentRuntimeInfo, RuntimeInfo } from './parsedTypes';
import { JsonRuntimeInfo, JsonFunctionContainer } from './inputTypes';
import { parseJson } from './parseJson';

type AttributesByTraceIdMap = Map<
  string,
  {
    [argumentIndex: string]: ArgumentRuntimeInfo;
  }
>;

export class RuntimeInfoParser {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  parse(): RuntimeInfo {
    const jsonFile = fs.readFileSync(this.fileName);
    const runTimeInfo: RuntimeInfo = {};

    const jsonInfo = parseJson<JsonRuntimeInfo>(jsonFile.toString());

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
    Array.from(attributesAggregatedByTraceId.keys()).forEach((traceId) => {
      if (!(traceId in args)) {
        args[traceId] = [];
      }

      for (const argumentIndex in attributesAggregatedByTraceId.get(traceId) || {}) {
        args[traceId].push((attributesAggregatedByTraceId.get(traceId) || {})[argumentIndex]);
      }
    });

    return args;
  }

  private aggregateArgumentsByTraceId(functionInfo: JsonFunctionContainer): AttributesByTraceIdMap {
    const attributesAggregatedByTraceId: AttributesByTraceIdMap = new Map<
      string,
      {
        [argumentIndex: string]: ArgumentRuntimeInfo;
      }
    >();

    for (const argumentId in functionInfo.args) {
      const argumentInfo = functionInfo.args[argumentId];

      argumentInfo.interactions.forEach((interaction) => {
        const aggregatedAttributeByTraceId =
          attributesAggregatedByTraceId.get(interaction.traceId) || {};

        if (!(argumentId in aggregatedAttributeByTraceId)) {
          aggregatedAttributeByTraceId[argumentId] = {
            argumentIndex: argumentInfo.argumentIndex,
            argumentName: argumentInfo.argumentName,
            interactions: [],
          };
        }

        attributesAggregatedByTraceId.set(interaction.traceId, aggregatedAttributeByTraceId);

        const argument = aggregatedAttributeByTraceId[argumentId];
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
