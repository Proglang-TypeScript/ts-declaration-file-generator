import ArgumentDeclaration from '../ArgumentDeclaration';
import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';
import {
  createString,
  createNumber,
  createUndefined,
  createArray,
} from '../../dts/helpers/createDTSType';

describe('ArgumentDeclaration', () => {
  it('does not add the same type twice', () => {
    const a = new ArgumentDeclaration(0, 'some-argument');

    let types: DTSType[] = [];
    types = [
      createString(),
      createNumber(),
      createUndefined(),
      createString(),
      createArray(createNumber()),
    ];
    types.forEach((t) => a.addTypeOf(t));

    expect(a.getTypeOfs()).toHaveLength(4);
  });

  it('gets serialized in the same way regardless of the position of the types', () => {
    const a = new ArgumentDeclaration(0, 'some-argument');

    let types: DTSType[] = [];
    types = [
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.STRING },
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.UNDEFINED },
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.NUMBER },
    ];
    types.forEach((t) => a.addTypeOf(t));

    const b = new ArgumentDeclaration(0, 'some-argument');
    types = [
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.NUMBER },
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.STRING },
      { kind: DTSTypeKinds.KEYWORD, value: DTSTypeKeywords.UNDEFINED },
    ];
    types.forEach((t) => b.addTypeOf(t));

    expect(a.serialize()).toBe(b.serialize());
  });
});
