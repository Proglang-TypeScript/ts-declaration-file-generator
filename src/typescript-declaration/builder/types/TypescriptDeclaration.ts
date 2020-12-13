import { FunctionDeclaration } from '../../FunctionDeclaration';
import { InterfaceDeclaration } from '../../InterfaceDeclaration';
import { ClassDeclaration } from '../../ClassDeclaration';

export interface TypescriptDeclaration {
  module: string;
  methods: FunctionDeclaration[];
  interfaces: InterfaceDeclaration[];
  classes: ClassDeclaration[];
}
