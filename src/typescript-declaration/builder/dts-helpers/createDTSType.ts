import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';

export const createDTSType = (types: (SupportedTypes | string)[]): DTSType => {
  if (types.length === 0) {
    throw new Error('Types cannot be empty');
  }

  if (types.length > 1) {
    return {
      kind: DTSTypeKinds.UNION,
      value: types.map((type) => createDTSType([type])),
    };
  }

  const type = types[0];
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
        value: 'Function',
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
    kind: DTSTypeKinds.INTERFACE,
    value: type,
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
