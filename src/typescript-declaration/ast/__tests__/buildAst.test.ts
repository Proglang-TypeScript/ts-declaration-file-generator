import { emit, createFromString } from '../../ts-ast-utils/utils';
import { DTS, DTSFunctionModifiers } from '../types/index';
import { buildAst } from '../buildAst';

describe('Create Module AST', () => {
  it('creates a module with 1 function without parameters', async () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'foo',
          parameters: [],
          modifiers: [DTSFunctionModifiers.EXPORT],
          returnType: 'void',
          typeParameters: [],
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString('export function foo(): void;')));
  });
});
