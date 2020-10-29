import { DTSType } from './dtsType';

export interface DTSProperty {
  name: string;
  type: DTSType;
  optional: boolean;
}
