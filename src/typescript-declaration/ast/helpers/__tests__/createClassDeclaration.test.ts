import { createClassDeclaration } from '../createClassDeclaration';
import { DTSClass, DTSTypeKinds, DTSTypeKeywords } from '../../types';
import { assertNodeEqualsString } from './assertNodeEqualsString';

describe('createClassDeclaration', () => {
  it('creates a class without members', async () => {
    const classDeclaration: DTSClass = {
      name: 'MyClass',
    };

    assertNodeEqualsString(createClassDeclaration(classDeclaration), 'export class MyClass{}');
  });

  it('creates a class without members and declare keyword', async () => {
    const classDeclaration: DTSClass = {
      name: 'MyClass',
      export: false,
    };

    assertNodeEqualsString(createClassDeclaration(classDeclaration), 'declare class MyClass{}');
  });

  it('creates a class with constructors', async () => {
    const classDeclaration: DTSClass = {
      name: 'MyClass',
      constructors: [
        {},
        {
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
            },
          ],
        },
        {
          parameters: [
            {
              name: 'a',
              type: {
                kind: DTSTypeKinds.KEYWORD,
                value: DTSTypeKeywords.NUMBER,
              },
            },
          ],
        },
      ],
    };

    assertNodeEqualsString(
      createClassDeclaration(classDeclaration),
      `
    export class MyClass {
      constructor();
      constructor(a: string, b: number);
      constructor(a: number);
    }
    `,
    );
  });

  it('creates a class with methods', async () => {
    const classDeclaration: DTSClass = {
      name: 'MyClass',
      methods: [
        {
          name: 'foo',
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
            },
          ],
          returnType: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.BOOLEAN,
          },
        },
        {
          name: 'bar',
        },
      ],
    };

    assertNodeEqualsString(
      createClassDeclaration(classDeclaration),
      `
    export class MyClass {
      foo(a: string, b: number): boolean;
      bar();
    }
    `,
    );
  });
});
