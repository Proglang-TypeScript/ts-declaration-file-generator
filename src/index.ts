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

let moduleName = options['module-name'];
let builder = new FunctionDeclarationBuilder();
let functionDeclarations = builder.buildAll(reader.read(), moduleName);

let cleaner = new FunctionDeclarationCleaner();
functionDeclarations = cleaner.clean(functionDeclarations);

builder.getClassDeclarations().forEach(c => {
    c.methods = cleaner.clean(c.methods);
});

let typescriptModuleDeclaration = new TypescriptModuleDeclaration();
typescriptModuleDeclaration.module = moduleName.replace(/-/g, "_");
typescriptModuleDeclaration.methods = functionDeclarations;
typescriptModuleDeclaration.interfaces = builder.getInterfaceDeclarations();
typescriptModuleDeclaration.classes = builder.getClassDeclarations();

let writer = new DeclarationFileWriter();
writer.write(typescriptModuleDeclaration);