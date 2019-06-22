import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { TypescriptDeclaration } from './TypescriptDeclaration';
import { DeclarationFileWriter } from '../../DeclarationFileWriter';

export class ModuleTypescriptDeclaration implements TypescriptDeclaration{
    module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
    classes: ClassDeclaration[] = [];

    writeToFile(fileName: string) {
        let writer = new DeclarationFileWriter();
        writer.write(this);
    }
}