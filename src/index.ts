#!/usr/bin/env node

import { RuntimeInfoParser } from './runtime-info/parser/RunTimeInfoParser';
import { TypescriptDeclarationBuilder } from './typescript-declaration/builder/TypescriptDeclarationBuilder';
import { FunctionDeclarationCleaner } from './utils/FunctionDeclarationCleaner';
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
  new RuntimeInfoParser(options['runtime-info']).parse(),
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
