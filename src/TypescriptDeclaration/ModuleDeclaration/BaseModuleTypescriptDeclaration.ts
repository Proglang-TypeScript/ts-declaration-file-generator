import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { TypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/TypescriptDeclarationWriter';

export abstract class BaseModuleTypescriptDeclaration {
	protected abstract getTypescriptDeclarationWriter(): TypescriptDeclarationWriter;

	module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
    classes: ClassDeclaration[] = [];

    getFileContents(): string {
		let writer = this.getTypescriptDeclarationWriter();
        return writer.write(this, './');
    }
}