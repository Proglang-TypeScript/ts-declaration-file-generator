import { DTSFunction } from './dtsFunction';
import { DTSProperty } from './dtsProperty';
import { DTSTypeParameter } from './dtsTypeParameter';
import { DTSType } from './dtsType';

export type DTS = DTSNamespace;
export * from './dtsFunction';
export * from './dtsType';

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
  type: DTSType;
}

interface DTSClass {
  name: string;
  properties: DTSProperty[];
  methods: DTSFunction[];
  constructors: DTSFunction[];
  typeParameters: DTSTypeParameter[];
}
