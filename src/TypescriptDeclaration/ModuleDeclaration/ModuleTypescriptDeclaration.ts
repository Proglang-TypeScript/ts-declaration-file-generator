import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { TypescriptDeclaration } from './TypescriptDeclaration';
import { ModuleTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/ModuleTypescriptDeclarationWriter';

export class ModuleTypescriptDeclaration implements TypescriptDeclaration{
    module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
    classes: ClassDeclaration[] = [];

    writeToFile(outputDirectory: string) {
        let writer = new ModuleTypescriptDeclarationWriter();
        writer.write(this, outputDirectory);
    }
}