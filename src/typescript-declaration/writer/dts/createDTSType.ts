import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';

export const createDTSType = (types: (SupportedTypes | string)[]): DTSType => {
  if (types.length > 1) {
    return {
      kind: DTSTypeKinds.UNION,
      value: types.map((type) => createDTSType([type])),
    };
  }

  switch (types[0]) {
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
  }

  return {
    kind: DTSTypeKinds.KEYWORD,
    value: DTSTypeKeywords.UNKNOWN,
  };
};

type SupportedTypes =
  | 'string'
  | 'number'
  | 'undefined'
  | 'void'
  | 'null'
  | 'object'
  | 'boolean'
  | 'Function'
  | 'Array<any>';
