import ArgumentDeclaration from '../ArgumentDeclaration';

describe('ArgumentDeclaration', () => {
  it('should be serialized correctly taking into account the different types', () => {
    const a = new ArgumentDeclaration(0, 'some-argument');

    const types = ['undefind', 'string', 'number'];
    types.forEach((t) => a.addTypeOf(t));

    const serialized = a.serialize();
    expect(JSON.parse(serialized).typeOfs).toStrictEqual(types.sort());
  });
});
