import { DTSTypeKinds, DTSTypeKeywords, DTSInterface } from '../../types';
import { emit, createFromString } from '../../../ts-ast-utils/utils';
import { createInterfaceDeclaration } from '../createInterfaceDeclaration';
import ts from 'typescript';

describe('createInterface', () => {
  it('creates an interface with parameters', async () => {
    const interfaceDeclaration: DTSInterface = {
      name: 'Foo',
      properties: [
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
        },
      ],
    };

    const ast = createInterfaceDeclaration(interfaceDeclaration);

    assertInterfaceDeclarationEqualsString(ast, `export interface Foo {a: string; b: number;}`);
  });
});

const assertInterfaceDeclarationEqualsString = (
  interfaceDeclaration: ts.InterfaceDeclaration,
  code: string,
) => {
  expect(emit(createFromString(emit(interfaceDeclaration)))).toBe(emit(createFromString(code)));
};
