import { emit, createFromString } from '../../ts-ast-utils/utils';
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../types/index';
import { buildAst } from '../buildAst';

describe('Types', () => {
  it('creates a keyword type', () => {
    const keywords = new Map<DTSTypeKeywords, string>();
    keywords.set(DTSTypeKeywords.ANY, 'any');
    keywords.set(DTSTypeKeywords.NUMBER, 'number');
    keywords.set(DTSTypeKeywords.STRING, 'string');
    keywords.set(DTSTypeKeywords.UNKNOWN, 'unknown');
    keywords.set(DTSTypeKeywords.VOID, 'void');

    Array.from(keywords.keys()).forEach((keyword) => {
      const declaration: DTS = {
        functions: [
          {
            name: 'f',
            returnType: {
              kind: DTSTypeKinds.KEYWORD,
              value: keyword,
            },
          },
        ],
      };
      const ast = buildAst(declaration);

      expect(emit(ast)).toBe(emit(createFromString(`function f(): ${keywords.get(keyword)};`)));
    });
  });

  it('creates the string literal type', () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'f',
          returnType: {
            kind: DTSTypeKinds.LITERAL_TYPE,
            value: 'hello',
          },
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`function f(): "hello";`)));
  });

  it('creates the number literal type', () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'f',
          returnType: {
            kind: DTSTypeKinds.LITERAL_TYPE,
            value: 123.45,
          },
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`function f(): 123.45;`)));
  });

  it('creates the boolean literal type', () => {
    let declaration: DTS = {
      functions: [
        {
          name: 'f',
          returnType: {
            kind: DTSTypeKinds.LITERAL_TYPE,
            value: false,
          },
        },
      ],
    };
    let ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`function f(): false;`)));

    declaration = {
      functions: [
        {
          name: 'f',
          returnType: {
            kind: DTSTypeKinds.LITERAL_TYPE,
            value: true,
          },
        },
      ],
    };
    ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`function f(): true;`)));
  });

  it('creates the union type', () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'f',
          returnType: {
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
          },
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`function f(): number | "hello";`)));
  });
});

describe('Function', () => {
  it('creates a function', async () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'foo',
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString('function foo();')));
  });

  it('creates a function with return type', async () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'foo',
          returnType: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.VOID,
          },
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString('function foo(): void;')));
  });
});
