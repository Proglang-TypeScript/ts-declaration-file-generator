import { emit, createFromString } from '../../ts-ast-utils/utils';
import { DTS } from '../types/index';
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
