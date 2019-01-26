#!/usr/bin/env node

import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { FunctionDeclaration } from './TypescriptDeclaration/FunctionDeclaration';
import { TypescriptModuleDeclaration } from './TypescriptDeclaration/TypescriptModuleDeclaration';
import { DeclarationFileWriter } from './DeclarationFileWriter'; 
import { FunctionDeclarationBuilder } from './FunctionDeclarationBuilder';
import { FunctionDeclarationCleaner } from './FunctionDeclarationCleaner';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
    { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
    { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json'}
];

let options = commandLineArgs(optionDefinitions);

let runTimeInfo = new RunTimeInfoUtils.RuntimeInfoReader().read(options['runtime-info']).info;

let builder = new FunctionDeclarationBuilder();
let functionDeclarations: FunctionDeclaration[] = []; 
for (let key in runTimeInfo) {
    functionDeclarations = functionDeclarations.concat(builder.build(runTimeInfo[key]));
}

let cleaner = new FunctionDeclarationCleaner(functionDeclarations, builder.interfaceDeclarations);
functionDeclarations = cleaner.clean();

let typescriptModuleDeclaration = new TypescriptModuleDeclaration();
typescriptModuleDeclaration.module = options['module-name'].replace(/-/g, "_");
typescriptModuleDeclaration.methods = functionDeclarations;
typescriptModuleDeclaration.interfaces = builder.getInterfaceDeclarations();

let writer = new DeclarationFileWriter();
writer.write(typescriptModuleDeclaration);