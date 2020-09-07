import { InterfaceDeclaration } from '../src/TypescriptDeclaration/InterfaceDeclaration';
import { InterfaceSubsetPrimitiveValidator } from '../src/utils/InterfaceSubsetPrimitiveValidator';

describe('InterfaceSubsetPrimitiveValidator', () => {
    describe('String validator', () => {
        it('should return false for an empty interface', () => {
            expect(
                new InterfaceSubsetPrimitiveValidator().isInterfaceSubsetOfString(new InterfaceDeclaration())
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
    });
})