#!/usr/bin/env node

import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { FunctionDeclaration } from './TypescriptDeclaration/FunctionDeclaration';
import { TypescriptModuleDeclaration } from './TypescriptDeclaration/TypescriptModuleDeclaration';
import { InterfaceDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';
import { DeclarationFileWriter } from './DeclarationFileWriter'; 
import { FunctionDeclarationBuilder } from './FunctionDeclarationBuilder';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
    { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
    { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json'}
];

let options = commandLineArgs(optionDefinitions);

let runTimeInfo = new RunTimeInfoUtils.RuntimeInfoReader().read(options['runtime-info']).info;
let builder = new FunctionDeclarationBuilder();
let typescriptModuleDeclaration = new TypescriptModuleDeclaration();

let functionDeclarations: FunctionDeclaration[] = []; 
for (let key in runTimeInfo) {
    functionDeclarations.push(builder.build(runTimeInfo[key]));
}

let writer = new DeclarationFileWriter();

typescriptModuleDeclaration.module = options['module-name'];
typescriptModuleDeclaration.methods = functionDeclarations;

typescriptModuleDeclaration.interfaces = builder.interfaceDeclarations;

writer.write(typescriptModuleDeclaration);