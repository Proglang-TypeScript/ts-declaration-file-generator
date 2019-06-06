import { FunctionDeclaration } from './FunctionDeclaration';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import { ClassDeclaration } from './ClassDeclaration';

export class TypescriptModuleDeclaration {
    module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
    classes: ClassDeclaration[] = [];
}