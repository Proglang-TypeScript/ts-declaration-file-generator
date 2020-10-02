import { InterfaceDeclaration } from '../../src/TypescriptDeclaration/InterfaceDeclaration';

describe('InterfaceDeclaration', () => {
  describe('addAttribue', () => {
    it('adds attributes with different types', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('some-attribute', ['string']);

      i.addAttribute('another-attribute', ['number']);

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].type).toStrictEqual(['string']);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].type).toStrictEqual(['number']);
    });

    it('concatenates the types of same attribute with different type', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('some-attribute', ['string']);

      i.addAttribute('another-attribute', ['number']);

      i.addAttribute('another-attribute', ['boolean']);

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].type).toStrictEqual(['string']);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].type).toStrictEqual(['number', 'boolean']);
    });

    it('adds attributes with name of properties of Object (name in Object === true)', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('constructor', ['string']);

      i.addAttribute('hasOwnProperty', ['number']);

      expect(i.getAttributes()).toHaveLength(2);
    });
  });

  describe('mergeWith', () => {
    it('does not change the attributes when merging with a new InterfaceDeclaration', () => {
      const i = new InterfaceDeclaration();
      i.addAttribute('a', ['string']);
      i.addAttribute('b', ['string']);

      i.mergeWith(new InterfaceDeclaration());
      expect(i.getAttributes()).toHaveLength(2);
    });

    it('adds the attributes of the merged interface', () => {
      const i = new InterfaceDeclaration();
      i.addAttribute('a', ['string']);
      i.addAttribute('b', ['string']);

      expect(i.getAttributes()).toHaveLength(2);

      const concatenatedInterfaceDeclaration = new InterfaceDeclaration();
      concatenatedInterfaceDeclaration.addAttribute('c', ['string']);

      i.mergeWith(concatenatedInterfaceDeclaration);
      expect(i.getAttributes()).toHaveLength(3);
    });
  });
});
