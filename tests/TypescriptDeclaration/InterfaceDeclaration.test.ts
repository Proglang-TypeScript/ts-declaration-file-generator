import { InterfaceDeclaration } from '../../src/TypescriptDeclaration/InterfaceDeclaration';

describe('InterfaceDeclaration', () => {
  describe('addAttribue', () => {
    it('adds attributes with different types', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute({
        name: 'some-attribute',
        type: ['string'],
      });

      i.addAttribute({
        name: 'another-attribute',
        type: ['number'],
      });

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].type).toStrictEqual(['string']);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].type).toStrictEqual(['number']);
    });

    it('concatenates the types of same attribute with different type', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute({
        name: 'some-attribute',
        type: ['string'],
      });

      i.addAttribute({
        name: 'another-attribute',
        type: ['number'],
      });

      i.addAttribute({
        name: 'another-attribute',
        type: ['boolean'],
      });

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].type).toStrictEqual(['string']);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].type).toStrictEqual(['number', 'boolean']);
    });

    it('adds attributes with name of properties of Object (name in Object === true)', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute({
        name: 'constructor',
        type: ['string'],
      });

      i.addAttribute({
        name: 'hasOwnProperty',
        type: ['number'],
      });

      expect(i.getAttributes()).toHaveLength(2);
    });
  });
});
