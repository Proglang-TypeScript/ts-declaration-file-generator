import { DTSProperty } from './dtsProperty';
import { DTSType } from './dtsType';
import { DTSTypeParameter } from './dtsTypeParameter';

export interface DTSFunction {
  name: string;
  parameters?: DTSProperty[];
  returnType?: DTSType;
  modifiers?: DTSFunctionModifiers[];
  typeParameters?: DTSTypeParameter[];
  isConstructor?: boolean;
  export?: boolean;
}

export const enum DTSFunctionModifiers {
  EXPORT,
  DECLARE,
}
