import { DTSFunction, DTSTypeKinds, DTSTypeKeywords } from '../../types';
import { createFunctionDeclaration } from '../createFunctionDeclaration';
import { emit } from '../../../ts-ast-utils/utils';

describe('createFunctionDeclaration', () => {
  it('creates a function', async () => {
    const functionDeclaration: DTSFunction = {
      name: 'foo',
    };
    const ast = createFunctionDeclaration(functionDeclaration);

    expect(emit(ast)).toBe('function foo();');
  });

  it('creates a function with return type', async () => {
    const functionDeclaration: DTSFunction = {
      name: 'foo',
      returnType: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.VOID,
      },
    };
    const ast = createFunctionDeclaration(functionDeclaration);

    expect(emit(ast)).toBe('function foo(): void;');
  });
});
