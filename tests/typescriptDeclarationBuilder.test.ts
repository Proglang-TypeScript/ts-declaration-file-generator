import { TypescriptDeclarationBuilder } from '../src/TypescriptDeclarationBuilder';
import { RuntimeInfoReader } from '../src/RunTimeInfoUtils';
import { FunctionDeclarationCleaner } from '../src/FunctionDeclarationCleaner';

describe('TypescriptDeclarationBuilder', () => {
	describe('optional parameters', () => {
		it('should mark the same argument as optional in all occurences of the function', () => {
			let builder = new TypescriptDeclarationBuilder(new FunctionDeclarationCleaner());
			builder.build(
				new RuntimeInfoReader('tests/files/optional-parameters/output.json').read(),
				'build-name'
			);

			builder.functionDeclarations.forEach(f => {
				expect(f.getArguments()[1].isOptional()).toBe(true);
			});
		});
	})
})