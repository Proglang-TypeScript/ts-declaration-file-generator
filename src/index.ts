#!/usr/bin/env node

import { RuntimeInfoParser } from './runtime-info/parser/RunTimeInfoParser';
import { TypescriptDeclarationBuilder } from './typescript-declaration/builder/TypescriptDeclarationBuilder';
import commandLineArgs from 'command-line-args';
import { writeDTS } from './typescript-declaration/writer/writeDTS';

const optionDefinitions = [
  { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
  { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json' },
  { name: 'output-directory', alias: 'o', type: String, defaultValue: './output' },
];

const options = commandLineArgs(optionDefinitions);

const builder = new TypescriptDeclarationBuilder();
const dts = builder.build(
  new RuntimeInfoParser(options['runtime-info']).parse(),
  options['module-name'],
);

(async () => {
  writeDTS(dts, `${options['output-directory']}/${options['module-name']}/index.d.ts`);
})();
