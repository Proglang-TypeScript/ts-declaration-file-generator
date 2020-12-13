import { DTSFunction, DTSTypeKinds, DTSTypeKeywords } from '../../types';
import { createFunctionDeclaration } from '../createFunctionDeclaration';
import { emit } from '../../../ts-ast-utils/utils';

describe('createFunctionDeclaration', () => {
  it('creates a function', async () => {
    const functionDeclaration: DTSFunction = {
      name: 'foo',
    };
    const ast = createFunctionDeclaration(functionDeclaration);

    expect(emit(ast)).toBe('export function foo();');
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

    expect(emit(ast)).toBe('export function foo(): void;');
  });

  it('creates a function with parameters', async () => {
    const functionDeclaration: DTSFunction = {
      name: 'foo',
      returnType: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.VOID,
      },
      parameters: [
        {
          name: 'a',
          type: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.STRING,
          },
        },
        {
          name: 'b',
          type: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
          optional: true,
        },
      ],
    };
    const ast = createFunctionDeclaration(functionDeclaration);

    expect(emit(ast)).toBe('export function foo(a: string, b?: number): void;');
  });

  it('creates a function with declare modifier', async () => {
    const functionDeclaration: DTSFunction = {
      name: 'foo',
      export: false,
    };
    const ast = createFunctionDeclaration(functionDeclaration);

    expect(emit(ast)).toBe('declare function foo();');
  });
});
