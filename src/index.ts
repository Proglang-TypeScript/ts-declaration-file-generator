#!/usr/bin/env node

import { RuntimeInfoReader } from './RunTimeInfoUtils';
import { TypescriptDeclarationBuilder } from './TypescriptDeclarationBuilder';
import { FunctionDeclarationCleaner } from './FunctionDeclarationCleaner';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
    { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
    { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json'},
    { name: 'output-directory', alias: 'o', type: String, defaultValue: './output' }
];

let options = commandLineArgs(optionDefinitions);

let builder = new TypescriptDeclarationBuilder(new FunctionDeclarationCleaner());
let typescriptModuleDeclaration = builder.buildAll(
    new RuntimeInfoReader(options['runtime-info']).read(),
    options['module-name']
);

typescriptModuleDeclaration.writeToFile(options['output-directory']);