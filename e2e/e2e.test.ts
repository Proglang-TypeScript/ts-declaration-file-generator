import { promises as fs } from 'fs';
import { TypescriptDeclarationBuilder } from '../src/typescript-declaration/builder/TypescriptDeclarationBuilder';
import { RuntimeInfoParser } from '../src/runtime-info/parser/RunTimeInfoParser';
import { emit, createFromString } from '../src/typescript-declaration/ts-ast-utils/utils';
import { buildAst } from '../src/typescript-declaration/ast/buildAst';

describe('End to end tests', () => {
  it('Generates the same declaration files', async () => {
    const moduleNames = (await fs.readdir(`${__dirname}/examples`, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    return Promise.all(
      moduleNames.map(async (moduleName) => {
        const builder = new TypescriptDeclarationBuilder();
        const dts = builder.build(
          new RuntimeInfoParser(`${__dirname}/examples/${moduleName}/output.json`).parse(),
          moduleName,
        );

        const expectedDTSContent = (
          await fs.readFile(`${__dirname}/examples/${moduleName}/index.d.ts`)
        ).toString();

        expect(emit(buildAst(dts))).toBe(emit(createFromString(expectedDTSContent)));
      }),
    );
  });
});
