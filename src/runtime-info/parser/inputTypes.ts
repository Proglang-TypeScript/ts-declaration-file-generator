export type JsonRuntimeInfo = { [functionId: string]: JsonFunctionContainer };

export interface JsonFunctionContainer {
  functionId: string;
  functionName: string;
  args: { [argumentIndex: string]: JsonArgumentContainer };
  returnTypeOfs: { typeOf: string; traceId: string }[];
  functionIid: number;
  requiredModule: string;
  isExported: boolean;
  isConstructor: boolean;
  constructedBy: string;
}

export interface JsonArgumentContainer {
  argumentIndex: number;
  argumentName: string;
  interactions: JsonInteraction[];
}

export interface JsonInteraction {
  code: string;
  typeof: string;
  returnTypeOf: string;
  field: string;
  followingInteractions?: JsonInteraction[];
  traceId: string;
}
