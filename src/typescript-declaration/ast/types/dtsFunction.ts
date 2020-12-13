import { DTSProperty } from './dtsProperty';
import { DTSType } from './dtsType';

export interface DTSFunction {
  name: string;
  parameters?: DTSProperty[];
  returnType?: DTSType;
  export?: boolean;
}
