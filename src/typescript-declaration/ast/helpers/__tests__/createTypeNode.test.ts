import { DTSTypeKeywords, DTSTypeKinds, DTSType } from '../../types';
import { createTypeNode } from '../createTypeNode';
import { createFromString, emit } from '../../../ts-ast-utils/utils';

describe('Types', () => {
  it('creates a keyword type', () => {
    const keywords = new Map<DTSTypeKeywords, string>();
    keywords.set(DTSTypeKeywords.ANY, 'any');
    keywords.set(DTSTypeKeywords.NUMBER, 'number');
    keywords.set(DTSTypeKeywords.STRING, 'string');
    keywords.set(DTSTypeKeywords.UNKNOWN, 'unknown');
    keywords.set(DTSTypeKeywords.VOID, 'void');

    Array.from(keywords.keys()).forEach((keyword) => {
      const type: DTSType = {
        kind: DTSTypeKinds.KEYWORD,
        value: keyword,
      };

      const typeNode = createTypeNode(type);
      const expectedType = `${keywords.get(keyword)};`;
      expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));
    });
  });

  it('creates the string literal type', () => {
    const type: DTSType = {
      kind: DTSTypeKinds.LITERAL_TYPE,
      value: 'hello',
    };

    const typeNode = createTypeNode(type);
    const expectedType = `"hello"`;
    expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));
  });

  it('creates the number literal type', () => {
    const type: DTSType = {
      kind: DTSTypeKinds.LITERAL_TYPE,
      value: 123.45,
    };

    const typeNode = createTypeNode(type);
    const expectedType = `123.45`;
    expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));
  });

  it('creates the boolean literal type', () => {
    let type: DTSType = {
      kind: DTSTypeKinds.LITERAL_TYPE,
      value: false,
    };

    let typeNode = createTypeNode(type);
    let expectedType = `false`;
    expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));

    type = {
      kind: DTSTypeKinds.LITERAL_TYPE,
      value: true,
    };

    typeNode = createTypeNode(type);
    expectedType = `true`;
    expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));
  });

  it('creates the union type', () => {
    const type: DTSType = {
      kind: DTSTypeKinds.UNION,
      value: [
        {
          kind: DTSTypeKinds.KEYWORD,
          value: DTSTypeKeywords.NUMBER,
        },
        {
          kind: DTSTypeKinds.LITERAL_TYPE,
          value: 'hello',
        },
      ],
    };

    const typeNode = createTypeNode(type);
    const expectedType = `number | "hello"`;
    expect(emit(typeNode)).toBe(emit(createFromString(expectedType)));
  });
});
