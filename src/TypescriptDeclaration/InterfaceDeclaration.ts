import { FunctionDeclaration } from './FunctionDeclaration';

export interface InterfaceAttributeDeclaration {
    name: string,
    type: string
}

export class InterfaceDeclaration {
    name: string = "";
    methods: FunctionDeclaration[] = [];
    attributes: InterfaceAttributeDeclaration[] = [];
}