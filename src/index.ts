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

let i1 = new InterfaceDeclaration();
i1.name = "MyInterface";
i1.attributes.push(
    {
        name: "someValue",
        type: "number"
    },
    {
        name: "anotherValue",
        type: "string"
    }
);

let m1 = new FunctionDeclaration();
m1.name = "myMethod";
m1.differentReturnTypeOfs = ["string"];
m1.addArgument(
    {
        name: "firstArgument",
        index: 0,
        differentTypeOfs: ["string"]
    }
);

let m2 = new FunctionDeclaration();
m2.name = "myOtherMethod";
m2.differentReturnTypeOfs = ["string"];
m2.addArgument(
    {
        name: "firstArgument",
        index: 0,
        differentTypeOfs: ["number", "boolean"]
    }
);

i1.methods.push(m1, m2);

typescriptModuleDeclaration.interfaces.push(i1);

writer.write(typescriptModuleDeclaration);