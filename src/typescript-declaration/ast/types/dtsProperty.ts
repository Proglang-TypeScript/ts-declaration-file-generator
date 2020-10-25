import { DTSPropertyType } from './dtsPropertyTypes';

export interface DTSProperty {
  name: string;
  type: DTSPropertyType;
  optional: boolean;
}
