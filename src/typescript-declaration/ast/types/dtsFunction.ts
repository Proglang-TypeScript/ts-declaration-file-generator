import { DTSProperty } from './dtsProperty';
import { DTSType } from './dtsType';
import { DTSTypeParameter } from './dtsTypeParameter';
import { DTSModifiers } from '.';

export interface DTSFunction {
  name: string;
  parameters?: DTSProperty[];
  returnType?: DTSType;
  modifiers?: DTSModifiers[];
  typeParameters?: DTSTypeParameter[];
  isConstructor?: boolean;
  export?: boolean;
}
