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
});
