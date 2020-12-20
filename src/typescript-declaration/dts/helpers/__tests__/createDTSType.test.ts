import {
  createString,
  createNumber,
  createUndefined,
  createNull,
  createObject,
  createBoolean,
  createVoid,
  createFunction,
  createArray,
  createAny,
  createInterface,
  createUnion,
} from '../createDTSType';
import { DTSTypeKinds, DTSTypeKeywords, DTSTypeUnion } from '../../../ast/types';

describe('createDTSType', () => {
  it('creates the string type', () => {
    expect(createString()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.STRING,
    });
  });

  it('creates the number type', () => {
    expect(createNumber()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.NUMBER,
    });
  });

  it('creates the undefined type', () => {
    expect(createUndefined()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.UNDEFINED,
    });
  });

  it('creates the null type', () => {
    expect(createNull()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.NULL,
    });
  });

  it('creates the object type', () => {
    expect(createObject()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.OBJECT,
    });
  });

  it('creates the boolean type', () => {
    expect(createBoolean()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.BOOLEAN,
    });
  });

  it('creates the void type', () => {
    expect(createVoid()).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.VOID,
    });
  });

  it('creates the Function type', () => {
    expect(createFunction()).toStrictEqual({
      kind: DTSTypeKinds.TYPE_REFERENCE,
      value: 'Function',
    });
  });

  it('creates the Array type', () => {
    expect(createArray(createAny())).toStrictEqual({
      kind: DTSTypeKinds.ARRAY,
      value: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.ANY,
      },
    });

    expect(createArray(createString())).toStrictEqual({
      kind: DTSTypeKinds.ARRAY,
      value: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.STRING,
      },
    });

    expect(createArray(createNumber())).toStrictEqual({
      kind: DTSTypeKinds.ARRAY,
      value: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.NUMBER,
      },
    });
  });

  it('creates the Union type', () => {
    const expectedType: DTSTypeUnion = {
      kind: DTSTypeKinds.UNION,
      value: [
        {
          kind: DTSTypeKinds.ARRAY,
          value: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.ANY,
          },
        },
        {
          kind: DTSTypeKinds.KEYWORD,
          value: DTSTypeKeywords.STRING,
        },
      ],
    };

    expect(createUnion([createArray(createAny()), createString()])).toStrictEqual(expectedType);
  });

  it('creates the Type Reference', () => {
    const expectedType = {
      kind: DTSTypeKinds.INTERFACE,
      value: 'SomeType',
    };

    expect(createInterface('SomeType')).toStrictEqual(expectedType);
  });
});
