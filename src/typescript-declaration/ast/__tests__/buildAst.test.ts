import { emit, createFromString } from '../../ts-ast-utils/utils';
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../types/index';
import { buildAst } from '../buildAst';

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
