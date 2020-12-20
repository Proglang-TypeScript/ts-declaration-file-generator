import { InterfaceDeclaration } from '../InterfaceDeclaration';
import {
  createUndefined,
  createNumber,
  createString,
  createBoolean,
} from '../../dts/helpers/createDTSType';

describe('InterfaceDeclaration', () => {
  describe('optional', () => {
    it('correctly flags an attribute as optional', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('some-attribute', [createUndefined(), createNumber()]);
      expect(
        i
          .getAttributes()
          .find((v) => v.name === 'some-attribute')
          ?.isOptional(),
      ).toBe(true);
    });
  });

  describe('addAttribue', () => {
    it('adds attributes with different types', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('some-attribute', [createString()]);

      i.addAttribute('another-attribute', [createNumber()]);

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].getTypeOfs()).toStrictEqual([createString()]);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].getTypeOfs()).toStrictEqual([createNumber()]);
    });

    it('concatenates the types of same attribute with different type', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('some-attribute', [createString()]);

      i.addAttribute('another-attribute', [createNumber()]);

      i.addAttribute('another-attribute', [createBoolean()]);

      const attributes = i.getAttributes();
      expect(attributes).toHaveLength(2);
      expect(attributes[0].name).toBe('some-attribute');
      expect(attributes[0].getTypeOfs()).toStrictEqual([createString()]);

      expect(attributes[1].name).toBe('another-attribute');
      expect(attributes[1].getTypeOfs()).toStrictEqual([createNumber(), createBoolean()]);
    });

    it('adds attributes with name of properties of Object (name in Object === true)', () => {
      const i = new InterfaceDeclaration();

      i.addAttribute('constructor', [createString()]);

      i.addAttribute('hasOwnProperty', [createNumber()]);

      expect(i.getAttributes()).toHaveLength(2);
    });
  });

  describe('mergeWith', () => {
    it('does not change the attributes when merging with a new InterfaceDeclaration', () => {
      const i = new InterfaceDeclaration();
      i.addAttribute('a', [createString()]);
      i.addAttribute('b', [createString()]);

      i.mergeWith(new InterfaceDeclaration());
      expect(i.getAttributes()).toHaveLength(2);
    });

    it('adds the attributes of the merged interface', () => {
      const i = new InterfaceDeclaration();
      i.addAttribute('a', [createString()]);
      i.addAttribute('b', [createString()]);

      expect(i.getAttributes()).toHaveLength(2);

      const concatenatedInterfaceDeclaration = new InterfaceDeclaration();
      concatenatedInterfaceDeclaration.addAttribute('c', [createString()]);

      i.mergeWith(concatenatedInterfaceDeclaration);
      expect(i.getAttributes()).toHaveLength(3);
    });
  });
});
