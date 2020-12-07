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
  field: string | number; // To deal with fields with type number, i.e. when accessing an element of an array (myArray[1]).
  followingInteractions?: JsonInteraction[];
  traceId: string;
}
