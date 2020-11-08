import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';

export const createDTSType = (type: string): DTSType => {
  switch (type) {
    case 'string':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.STRING,
      };

    case 'number':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.NUMBER,
      };

    case 'undefined':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.UNDEFINED,
      };

    case 'void':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.VOID,
      };

    case 'null':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.NULL,
      };

    case 'object':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.OBJECT,
      };

    case 'boolean':
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.BOOLEAN,
      };

    case 'Function':
      return {
        kind: DTSTypeKinds.TYPE_REFERENCE,
        value: {
          referenceName: 'Function',
        },
      };

    case 'Array<any>':
      return {
        kind: DTSTypeKinds.ARRAY,
        value: {
          kind: DTSTypeKinds.KEYWORD,
          value: DTSTypeKeywords.ANY,
        },
      };

    default:
      return {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.UNKNOWN,
      };
  }
};
