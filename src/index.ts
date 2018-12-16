#!/usr/bin/env node

import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import * as FunctionDeclaration from './FunctionDeclaration';
import { DeclarationFileWriter } from './DeclarationFileWriter'; 
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
    { name: 'module-name', alias: 'm', type: String, defaultValue: 'myModule' },
    { name: 'runtime-info', alias: 'i', type: String, defaultValue: './output.json'}
];

let options = commandLineArgs(optionDefinitions);

let runTimeInfo = new RunTimeInfoUtils.RuntimeInfoReader().read(options['runtime-info']).info;
let builder = new RunTimeInfoUtils.FunctionDeclarationBuilder();

let functionDeclarations: FunctionDeclaration.FunctionDeclaration[] = []; 
for (let key in runTimeInfo) {
    functionDeclarations.push(builder.build(runTimeInfo[key]));
}

let writer = new DeclarationFileWriter(options['module-name']);
writer.write(functionDeclarations);