import { TypescriptDeclarationBuilder } from '../TypescriptDeclarationBuilder';
import { RuntimeInfoParser } from '../../../runtime-info/parser/RunTimeInfoParser';

describe('TypescriptDeclarationBuilder', () => {
  describe('optional parameters', () => {
    it('should mark the same argument as optional in all occurences of the function', () => {
      const builder = new TypescriptDeclarationBuilder();
      const dts = builder.build(
        new RuntimeInfoParser(`${__dirname}/files/optional-parameters/output.json`).parse(),
        'build-name',
      );

      dts.functions?.forEach((f) => {
        expect(f.parameters && f.parameters[1]?.optional).toBe(true);
      });
    });
  });
});
