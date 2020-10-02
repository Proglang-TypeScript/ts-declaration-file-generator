import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceDeclaration } from '../InterfaceDeclaration';
import { ClassDeclaration } from '../ClassDeclaration';
import { BaseTypescriptDeclarationWriter } from '../TypescriptDeclarationWriter/BaseTypescriptDeclarationWriter';

export abstract class BaseTemplateTypescriptDeclaration {
  protected abstract getTypescriptDeclarationWriter(): BaseTypescriptDeclarationWriter;

  module = '';
  methods: FunctionDeclaration[] = [];
  interfaces: InterfaceDeclaration[] = [];
  classes: ClassDeclaration[] = [];

  getFileContents(): string {
    const writer = this.getTypescriptDeclarationWriter();
    return writer.write(this);
  }
}
