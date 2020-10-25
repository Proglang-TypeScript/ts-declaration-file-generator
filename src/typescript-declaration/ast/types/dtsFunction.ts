import { DTSProperty } from './dtsProperty';
import { DTSPropertyType } from './dtsPropertyTypes';
import { DTSTypeParameter } from './dtsTypeParameter';

export interface DTSFunction {
  name: string;
  parameters: DTSProperty[];
  returnType: DTSPropertyType;
  modifiers: DTSFunctionModifiers[];
  typeParameters: DTSTypeParameter[];
  isConstructor?: boolean;
}

export const enum DTSFunctionModifiers {
  EXPORT,
}
