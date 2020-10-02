export interface FunctionRuntimeInfo {
  functionId: string;
  functionName: string;
  args: { [traceId: string]: ArgumentRuntimeInfo[] };
  returnTypeOfs: { [traceId: string]: string };
  functionIid: number;
  requiredModule: string;
  isExported: boolean;
  isConstructor: boolean;
  constructedBy: string;
}

export interface ArgumentRuntimeInfo {
  argumentIndex: number;
  argumentName: string;
  interactions: InteractionRuntimeInfo[];
}

export interface InteractionRuntimeInfo {
  code: string;
  typeof: string;
  returnTypeOf: string;
  field: string;
  followingInteractions?: InteractionRuntimeInfo[];
  traceId: string;
}
