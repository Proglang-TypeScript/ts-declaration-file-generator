import ArgumentDeclaration from '../ArgumentDeclaration';
import { DTSType, DTSTypeKinds, DTSTypeKeywords } from '../../ast/types';

describe('ArgumentDeclaration', () => {
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
