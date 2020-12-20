import { createDTSType } from '../createDTSType';
import { DTSTypeKinds, DTSTypeKeywords, DTSTypeUnion } from '../../../ast/types';

describe('createDTSType', () => {
  it('creates the string type', () => {
    expect(createDTSType(['string'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.STRING,
    });
  });

  it('creates the number type', () => {
    expect(createDTSType(['number'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.NUMBER,
    });
  });

  it('creates the undefined type', () => {
    expect(createDTSType(['undefined'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.UNDEFINED,
    });
  });

  it('creates the null type', () => {
    expect(createDTSType(['null'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.NULL,
    });
  });

  it('creates the object type', () => {
    expect(createDTSType(['object'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.OBJECT,
    });
  });

  it('creates the boolean type', () => {
    expect(createDTSType(['boolean'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.BOOLEAN,
    });
  });

  it('creates the void type', () => {
    expect(createDTSType(['void'])).toStrictEqual({
      kind: DTSTypeKinds.KEYWORD,
      value: DTSTypeKeywords.VOID,
    });
  });

  it('creates the Function type', () => {
    expect(createDTSType(['Function'])).toStrictEqual({
      kind: DTSTypeKinds.TYPE_REFERENCE,
      value: 'Function',
    });
  });

  it('creates the Array type', () => {
    expect(createDTSType(['Array<any>'])).toStrictEqual({
      kind: DTSTypeKinds.ARRAY,
      value: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.ANY,
      },
    });

    expect(createDTSType(['Array<string>'])).toStrictEqual({
      kind: DTSTypeKinds.ARRAY,
      value: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.STRING,
      },
    });

    expect(createDTSType(['Array<number>'])).toStrictEqual({
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

    expect(createDTSType(['Array<any>', 'string'])).toStrictEqual(expectedType);
  });

  it('creates the Type Reference', () => {
    const expectedType = {
      kind: DTSTypeKinds.INTERFACE,
      value: 'SomeType',
    };

    expect(createDTSType(['SomeType'])).toStrictEqual(expectedType);
  });
});
