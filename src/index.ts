#!/usr/bin/env node

import { RuntimeInfoReader } from './RunTimeInfoUtils';
import { TypescriptDeclarationBuilder } from './TypescriptDeclarationBuilder';
import { FunctionDeclarationCleaner } from './FunctionDeclarationCleaner';
import commandLineArgs from 'command-line-args';
import fs from 'fs';

const optionDefinitions = [
  { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
  { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json' },
  { name: 'output-directory', alias: 'o', type: String, defaultValue: './output' },
];

const options = commandLineArgs(optionDefinitions);

const builder = new TypescriptDeclarationBuilder(new FunctionDeclarationCleaner());
const typescriptModuleDeclaration = builder.build(
  new RuntimeInfoReader(options['runtime-info']).read(),
  options['module-name'],
);

const declarationFileContent = typescriptModuleDeclaration.getFileContents();

const filePath = options['output-directory'] + '/' + options['module-name'];
const fileName = filePath + '/index.d.ts';

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true });
}

if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
fs.writeFile(fileName, declarationFileContent, () => {});
