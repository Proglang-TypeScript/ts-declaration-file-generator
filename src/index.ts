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

let options = commandLineArgs(optionDefinitions);

let builder = new TypescriptDeclarationBuilder(new FunctionDeclarationCleaner());
let typescriptModuleDeclaration = builder.build(
  new RuntimeInfoReader(options['runtime-info']).read(),
  options['module-name'],
);

let declarationFileContent = typescriptModuleDeclaration.getFileContents();

let filePath = options['output-directory'] + '/' + options['module-name'];
let fileName = filePath + '/index.d.ts';

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true });
}

if (fs.existsSync(fileName)) {
  fs.unlinkSync(fileName);
}

fs.writeFile(fileName, declarationFileContent, () => {});
