import { FunctionDeclaration } from './FunctionDeclaration';
import { InterfaceDeclaration } from './InterfaceDeclaration';

export class TypescriptModuleDeclaration {
    module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
}