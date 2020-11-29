import { emit, createFromString } from '../../ts-ast-utils/utils';
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../types/index';
import { buildAst } from '../buildAst';

describe('Function', () => {
  it('creates functions outside a namespace', async () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'foo',
        },
        {
          name: 'bar',
        },
      ],
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString('export function foo(); export function bar();')));
  });

  it('creates functions inside a namespace', async () => {
    const declaration: DTS = {
      namespace: {
        name: 'SomeNamespace',
        functions: [
          {
            name: 'foo',
          },
          {
            name: 'bar',
          },
        ],
      },
    };
    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(
      emit(
        createFromString(`
      declare namespace SomeNamespace {
        export function foo();
        export function bar();
      `),
      ),
    );
  });
});

describe('Interface', () => {
  it('creates interfaces outside of a namepsace', () => {
    const declaration: DTS = {
      interfaces: [{ name: 'MyInterface' }, { name: 'MyOtherInterface' }],
    };

    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(
      emit(
        createFromString(`
          export interface MyInterface{}
          export interface MyOtherInterface{}
        `),
      ),
    );
  });

  it('creates interfaces inside of a namepsace', () => {
    const declaration: DTS = {
      namespace: {
        name: 'MyNamespace',
        interfaces: [{ name: 'MyInterface' }, { name: 'MyOtherInterface' }],
      },
    };

    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(
      emit(
        createFromString(`
          declare namespace MyNamespace {
            export interface MyInterface {}
            export interface MyOtherInterface {}
          }
        `),
      ),
    );
  });
});

describe('Class', () => {
  it('creates class outside of a namepsace', () => {
    const declaration: DTS = {
      classes: [
        {
          name: 'ClassA',
        },
        {
          name: 'ClassB',
        },
      ],
    };

    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(
      emit(
        createFromString(`
          export class ClassA{}
          export class ClassB{}
        `),
      ),
    );
  });

  it('creates class inside a namepsace', () => {
    const declaration: DTS = {
      namespace: {
        name: 'MyNamespace',
        classes: [
          {
            name: 'ClassA',
          },
          {
            name: 'ClassB',
          },
        ],
      },
    };

    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(
      emit(
        createFromString(`
          declare namespace MyNamespace {
            export class ClassA{}
            export class ClassB{}
          }
          `),
      ),
    );
  });
});

describe('Export assignment', () => {
  it('creates the export assignment', () => {
    const declaration: DTS = {
      exportAssignment: 'Foo',
    };

    const ast = buildAst(declaration);

    expect(emit(ast)).toBe(emit(createFromString(`export = Foo`)));
  });
});

describe('Type references', () => {
  it('writes the interface with a qualified name in a function parameter', () => {
    const declaration: DTS = {
      exportAssignment: 'Foo',
      functions: [
        {
          name: 'Foo',
          export: false,
          parameters: [
            {
              name: 'a',
              type: {
                kind: DTSTypeKinds.INTERFACE,
                value: 'MyInterface',
              },
            },
          ],
        },
      ],
      namespace: {
        name: 'Foo',
        interfaces: [
          {
            name: 'MyInterface',
            properties: [
              {
                name: 'b',
                type: {
                  kind: DTSTypeKinds.KEYWORD,
                  value: DTSTypeKeywords.NUMBER,
                },
              },
            ],
          },
        ],
      },
    };

    const ast = buildAst(declaration);
    expect(emit(ast)).toBe(
      emit(
        createFromString(`
    export = Foo;
    declare function Foo(a: Foo.MyInterface);
    declare namespace Foo {
      export interface MyInterface {
        b: number;
      }
    }
  `),
      ),
    );
  });

  it('writes the interface with a qualified name in a class method or constructor parameter', () => {
    const declaration: DTS = {
      exportAssignment: 'MyClass',
      classes: [
        {
          name: 'MyClass',
          export: false,
          constructors: [
            {
              parameters: [
                {
                  name: 'z',
                  type: {
                    kind: DTSTypeKinds.INTERFACE,
                    value: 'MyInterface',
                  },
                },
              ],
            },
          ],
          methods: [
            {
              name: 'foo',
              parameters: [
                {
                  name: 'a',
                  type: {
                    kind: DTSTypeKinds.INTERFACE,
                    value: 'MyInterface',
                  },
                },
              ],
            },
          ],
        },
      ],
      namespace: {
        name: 'MyClass',
        interfaces: [
          {
            name: 'MyInterface',
            properties: [
              {
                name: 'b',
                type: {
                  kind: DTSTypeKinds.KEYWORD,
                  value: DTSTypeKeywords.NUMBER,
                },
              },
            ],
          },
        ],
      },
    };

    const ast = buildAst(declaration);
    expect(emit(ast)).toBe(
      emit(
        createFromString(`
    export = MyClass;
    declare class MyClass {
      constructor(z: MyClass.MyInterface)
      foo(a: MyClass.MyInterface)
    }
    declare namespace MyClass {
      export interface MyInterface {
        b: number;
      }
    }
  `),
      ),
    );
  });

  it('writes the interface without a qualified name in an interface property inside a namespace', () => {
    const declaration: DTS = {
      namespace: {
        name: 'MyNamespace',
        interfaces: [
          {
            name: 'MyInterface',
            properties: [
              {
                name: 'a',
                type: {
                  kind: DTSTypeKinds.KEYWORD,
                  value: DTSTypeKeywords.NUMBER,
                },
              },
            ],
          },
          {
            name: 'MyOtherInterface',
            properties: [
              {
                name: 'b',
                type: {
                  kind: DTSTypeKinds.INTERFACE,
                  value: 'MyInterface',
                },
              },
            ],
          },
        ],
      },
    };

    const ast = buildAst(declaration);
    expect(emit(ast)).toBe(
      emit(
        createFromString(`
    declare namespace MyNamespace {
      export interface MyInterface {
        a: number;
      }

      export interface MyOtherInterface {
        b: MyNamespace.MyInterface;
      }
    }
  `),
      ),
    );
  });

  it('writes the interface with a qualified name in an union type', () => {
    const declaration: DTS = {
      functions: [
        {
          name: 'foo',
          parameters: [
            {
              name: 'a',
              type: {
                kind: DTSTypeKinds.UNION,
                value: [
                  {
                    kind: DTSTypeKinds.TYPE_REFERENCE,
                    value: 'Function',
                  },
                  {
                    kind: DTSTypeKinds.INTERFACE,
                    value: 'MyInterface',
                  },
                ],
              },
            },
          ],
        },
      ],
      namespace: {
        name: 'MyNamespace',
        interfaces: [
          {
            name: 'MyInterface',
            properties: [
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
      },
    };

    const ast = buildAst(declaration);
    expect(emit(ast)).toBe(
      emit(
        createFromString(`
    export function foo(a: Function | MyNamespace.MyInterface);
    declare namespace MyNamespace {
      export interface MyInterface {
        a: number;
      }
    }
  `),
      ),
    );
  });
});
