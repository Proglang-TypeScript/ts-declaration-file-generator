import { DTSFunction } from './dtsFunction';
import { DTSProperty } from './dtsProperty';
import { DTSTypeParameter } from './dtsTypeParameter';
import { DTSPropertyType } from './dtsPropertyTypes';

export type DTS = DTSNamespace;
export * from './dtsFunction';

interface DTSNamespace {
  name?: string;
  interfaces?: DTSInterface[];
  functions?: DTSFunction[];
  classes?: DTSClass[];
  exportAssignments?: string[];
  namespaces?: {
    [namespaceName: string]: DTSNamespace;
  };
}

interface DTSInterface {
  name: string;
  properties: DTSProperty[];
  methods: DTSFunction[];
  callSignatures: DTSFunction[];
  indexSignatures: DTSIndexSignature[];
  typeParameters: DTSTypeParameter[];
}

interface DTSIndexSignature {
  parameter: DTSProperty;
  type: DTSPropertyType;
}

interface DTSClass {
  name: string;
  properties: DTSProperty[];
  methods: DTSFunction[];
  constructors: DTSFunction[];
  typeParameters: DTSTypeParameter[];
}
