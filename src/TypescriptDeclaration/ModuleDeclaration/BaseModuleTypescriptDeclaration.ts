import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { TypescriptDeclaration } from './TypescriptDeclaration';
import { TypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/TypescriptDeclarationWriter';

export abstract class BaseModuleTypescriptDeclaration implements TypescriptDeclaration {
	protected abstract getTypescriptDeclarationWriter(): TypescriptDeclarationWriter;

	module: string = "";
    methods: FunctionDeclaration[] = [];
    interfaces: InterfaceDeclaration[] = [];
    classes: ClassDeclaration[] = [];

    writeToFile(outputDirectory: string) {
		let writer = this.getTypescriptDeclarationWriter();
        writer.write(this, outputDirectory);
    }
}