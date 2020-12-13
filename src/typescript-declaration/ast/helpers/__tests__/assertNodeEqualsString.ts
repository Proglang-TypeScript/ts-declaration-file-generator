import ts from 'typescript';
import { emit, createFromString } from '../../../ts-ast-utils/utils';

export const assertNodeEqualsString = (interfaceDeclaration: ts.Node, code: string) => {
  expect(emit(createFromString(emit(interfaceDeclaration)))).toBe(emit(createFromString(code)));
};
