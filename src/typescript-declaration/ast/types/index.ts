import { DTSFunction } from './dtsFunction';
import { DTSProperty } from './dtsProperty';
import { DTSTypeParameter } from './dtsTypeParameter';
import { DTSType } from './dtsType';

export type DTS = {
  functions?: DTSFunction[];
  classes?: DTSClass[];
  interfaces?: DTSInterface[];
  exportAssignment?: string;
  namespace?: DTSNamespace;
};

export * from './dtsFunction';
export * from './dtsType';

export interface DTSNamespace {
  name: string;
  interfaces?: DTSInterface[];
  functions?: DTSFunction[];
  classes?: DTSClass[];
}

export interface DTSInterface {
  name: string;
  properties?: DTSProperty[];
}

export interface DTSClass {
  name: string;
  properties?: DTSProperty[];
  methods?: DTSFunction[];
  constructors?: Omit<DTSFunction, 'name'>[];
  typeParameters?: DTSTypeParameter[];
  export?: boolean;
}

export const enum DTSModifiers {
  EXPORT,
  DECLARE,
}
