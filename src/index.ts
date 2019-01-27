#!/usr/bin/env node

import * as RunTimeInfoUtils from './RunTimeInfoUtils';
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

let reader = new RunTimeInfoUtils.RuntimeInfoReader(options['runtime-info']);

let builder = new FunctionDeclarationBuilder(reader);
let functionDeclarations = builder.buildAll();

let cleaner = new FunctionDeclarationCleaner(functionDeclarations, builder.interfaceDeclarations);
functionDeclarations = cleaner.clean();

let typescriptModuleDeclaration = new TypescriptModuleDeclaration();
typescriptModuleDeclaration.module = options['module-name'].replace(/-/g, "_");
typescriptModuleDeclaration.methods = functionDeclarations;
typescriptModuleDeclaration.interfaces = builder.getInterfaceDeclarations();

let writer = new DeclarationFileWriter();
writer.write(typescriptModuleDeclaration);