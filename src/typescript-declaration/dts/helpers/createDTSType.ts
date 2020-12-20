import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';

export const mergeDTSTypes = (types: DTSType[]): DTSType => {
  if (types.length === 0) {
    throw new Error('Types cannot be empty');
  }

  if (types.length > 1) {
    return createUnion(types);
  }

  return types[0];
};

export const createDTSTypeFromString = (types: (SupportedTypes | string)[]): DTSType => {
  if (types.length === 0) {
    throw new Error('Types cannot be empty');
  }

  if (types.length > 1) {
    return {
      kind: DTSTypeKinds.UNION,
      value: types.map((type) => createDTSTypeFromString([type])),
    };
  }

  const type = types[0];
  switch (type) {
    case 'any':
      return createAny();

    case 'string':
      return createString();

    case 'number':
      return createNumber();

    case 'undefined':
      return createUndefined();

    case 'void':
      return createVoid();

    case 'null':
      return createNull();

    case 'object':
      return createObject();

    case 'boolean':
      return createBoolean();

    case 'Function':
      return createFunction();
  }

  const arrayMatch = type.match(/Array<(.*)>/);
  if (arrayMatch && arrayMatch[1]) {
    const typeArrayElement = arrayMatch[1].split(',');
    return createArray(createDTSTypeFromString(typeArrayElement));
  }

  return createInterface(type);
};

export const createUnion = (types: DTSType[]): DTSType => {
  if (types.length === 0) {
    throw new Error('Types cannot be empty');
  }

  return {
    kind: DTSTypeKinds.UNION,
    value: types,
  };
};

export const createString = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.STRING,
});

export const createNumber = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.NUMBER,
});

export const createUndefined = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.UNDEFINED,
});

export const createNull = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.NULL,
});

export const createObject = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.OBJECT,
});

export const createArray = (type: DTSType): DTSType => ({
  kind: DTSTypeKinds.ARRAY,
  value: type,
});

export const createBoolean = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.BOOLEAN,
});

export const createFunction = (): DTSType => ({
  kind: DTSTypeKinds.TYPE_REFERENCE,
  value: 'Function',
});

export const createAny = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.ANY,
});

export const createVoid = (): DTSType => ({
  kind: DTSTypeKinds.KEYWORD,
  value: DTSTypeKeywords.VOID,
});

export const createInterface = (name: string): DTSType => ({
  kind: DTSTypeKinds.INTERFACE,
  value: name,
});

type SupportedTypes =
  | 'any'
  | 'string'
  | 'number'
  | 'undefined'
  | 'void'
  | 'null'
  | 'object'
  | 'boolean'
  | 'Function';
