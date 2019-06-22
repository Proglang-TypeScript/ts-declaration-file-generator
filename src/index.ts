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
let moduleName = options['module-name'];

let builder = new FunctionDeclarationBuilder(new FunctionDeclarationCleaner());
builder.buildAll(
    new RunTimeInfoUtils.RuntimeInfoReader(options['runtime-info']).read(),
    moduleName
);

let typescriptModuleDeclaration = new TypescriptModuleDeclaration();
typescriptModuleDeclaration.module = moduleName.replace(/-/g, "_");
typescriptModuleDeclaration.methods = builder.getFunctionDeclarations();
typescriptModuleDeclaration.interfaces = builder.getInterfaceDeclarations();
typescriptModuleDeclaration.classes = builder.getClassDeclarations();

let writer = new DeclarationFileWriter();
writer.write(typescriptModuleDeclaration);