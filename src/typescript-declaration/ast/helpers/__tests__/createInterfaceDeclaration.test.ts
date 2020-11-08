import { DTSTypeKinds, DTSTypeKeywords, DTSInterface } from '../../types';
import { createInterfaceDeclaration } from '../createInterfaceDeclaration';
import { assertNodeEqualsString } from './assertNodeEqualsString';

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

    assertNodeEqualsString(ast, `export interface Foo {a: string; b: number;}`);
  });
});
