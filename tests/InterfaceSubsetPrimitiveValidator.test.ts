import { InterfaceDeclaration } from '../src/TypescriptDeclaration/InterfaceDeclaration';
import { InterfaceSubsetPrimitiveValidator } from '../src/utils/InterfaceSubsetPrimitiveValidator';

describe('InterfaceSubsetPrimitiveValidator', () => {
    describe('String validator', () => {
        it('should return false for an empty interface', () => {
            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(new InterfaceDeclaration())
            ).toBe(false);
        });

        it('should return false for an interface containing some non-string attributes', () => {
            const stringInterface = new InterfaceDeclaration();
            stringInterface.addAttribute({
                name: 'hello',
                type: ['number']
            });

            stringInterface.addAttribute({
                name: 'world',
                type: ['string']
            });

            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface)
            ).toBe(false);
        });

        it('should return false for an interface containing both string and non-string attributes', () => {
            const stringInterface = new InterfaceDeclaration();
            stringInterface.addAttribute({
                name: 'length',
                type: ['number']
            });

            stringInterface.addAttribute({
                name: 'hello',
                type: ['string']
            });

            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface)
            ).toBe(false);
        });

        it('should return true for string attributes', () => {
            const stringInterface = new InterfaceDeclaration();
            stringInterface.addAttribute({
                name: 'length',
                type: ['number']
            });

            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface)
            ).toBe(true);
        });

        it('should return true for index access', () => {
            const stringInterface = new InterfaceDeclaration();
            stringInterface.addAttribute({
                name: '3',
                type: ['number']
            });

            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(stringInterface)
            ).toBe(true);
        });
    });
})