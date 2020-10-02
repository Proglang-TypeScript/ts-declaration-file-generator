import { JsonArgumentContainer, JsonInteraction, JsonFunctionContainer } from './inputTypes';

export type RuntimeInfo = { [id: string]: FunctionRuntimeInfo };

export interface FunctionRuntimeInfo extends Omit<JsonFunctionContainer, 'args' | 'returnTypeOfs'> {
  args: { [traceId: string]: ArgumentRuntimeInfo[] };
  returnTypeOfs: { [traceId: string]: string };
}

export type ArgumentRuntimeInfo = JsonArgumentContainer;

export type InteractionRuntimeInfo = JsonInteraction;
