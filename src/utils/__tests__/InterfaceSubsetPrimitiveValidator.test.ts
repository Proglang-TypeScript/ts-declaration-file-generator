import { InterfaceDeclaration } from '../../TypescriptDeclaration/InterfaceDeclaration';
import { InterfaceSubsetPrimitiveValidator } from '../InterfaceSubsetPrimitiveValidator';

describe('InterfaceSubsetPrimitiveValidator', () => {
  describe('String validator', () => {
    it('should return false for an empty interface', () => {
      expect(
        new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(
          new InterfaceDeclaration(),
        ),
      ).toBe(false);
    });

    it('should return false for an interface containing some non-string attributes', () => {
      const stringInterface = new InterfaceDeclaration();
      stringInterface.addAttribute('hello', ['number']);

      stringInterface.addAttribute('world', ['string']);

      expect(
        new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface),
      ).toBe(false);
    });

    it('should return false for an interface containing both string and non-string attributes', () => {
      const stringInterface = new InterfaceDeclaration();
      stringInterface.addAttribute('length', ['number']);

      stringInterface.addAttribute('hello', ['string']);

      expect(
        new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface),
      ).toBe(false);
    });

    it('should return true for string attributes', () => {
      const stringInterface = new InterfaceDeclaration();
      stringInterface.addAttribute('length', ['number']);

      expect(
        new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface),
      ).toBe(true);
    });

    it('should return true for index access', () => {
      const stringInterface = new InterfaceDeclaration();
      stringInterface.addAttribute('3', ['number']);

      expect(
        new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface),
      ).toBe(true);
    });
  });
});
