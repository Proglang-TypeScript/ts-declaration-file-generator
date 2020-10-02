import { TypescriptDeclarationBuilder } from '../TypescriptDeclarationBuilder';
import { RuntimeInfoParser } from '../../../runtime-info/parser/RunTimeInfoParser';
import { FunctionDeclarationCleaner } from '../../../utils/FunctionDeclarationCleaner';

describe('TypescriptDeclarationBuilder', () => {
  describe('optional parameters', () => {
    it('should mark the same argument as optional in all occurences of the function', () => {
      const builder = new TypescriptDeclarationBuilder(new FunctionDeclarationCleaner());
      builder.build(
        new RuntimeInfoParser(`${__dirname}/files/optional-parameters/output.json`).parse(),
        'build-name',
      );

      builder.functionDeclarations.forEach((f) => {
        expect(f.getArguments()[1].isOptional()).toBe(true);
      });
    });
  });
});
