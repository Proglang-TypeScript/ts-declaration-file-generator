import { FunctionDeclaration } from '../FunctionDeclaration';
import { InterfaceAttributeDeclaration } from '../InterfaceDeclaration';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';

export abstract class BaseTypescriptDeclarationWriter {
  interfaceNames: string[];
  protected exportNamespace: string;
  protected fileContents: string;

  protected abstract doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void;
  protected abstract getExportedName(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  ): string;

  constructor() {
    this.interfaceNames = [];
    this.exportNamespace = '';
    this.fileContents = '';
  }

  write(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): string {
    this.fileContents = '';

    this.interfaceNames = typescriptModuleDeclaration.interfaces.map((i) => {
      return i.name;
    });

    this.exportNamespace = this.getExportedName(typescriptModuleDeclaration);
    this.doWrite(typescriptModuleDeclaration);

    return this.fileContents;
  }

  protected writeExportModule(): void {
    this.fileContents += 'export = ' + this.exportNamespace + ';\n\n';
  }

  protected openNamespace(): void {
    this.fileContents += 'declare namespace ' + this.exportNamespace + ' {\n';
  }

  protected closeNamespace(): void {
    this.fileContents += '}';
  }

  protected getConstructorSignature(f: FunctionDeclaration) {
    const argumentsWithType = this.buildArgumentsWithType(f);

    return 'constructor(' + argumentsWithType + ')';
  }

  protected getFunctionNameWithTypes(f: FunctionDeclaration) {
    const argumentsWithType = this.buildArgumentsWithType(f);

    return `${f.name}(${argumentsWithType.join(', ')}): ${f.getReturnTypeOfs().join(' | ')}`;
  }

  protected buildArgumentsWithType(f: FunctionDeclaration): string[] {
    return f.getArguments().map((argument) => {
      let argumentTypes = argument.getTypeOfs();
      let colon = ':';
      if (argument.isOptional()) {
        if (argumentTypes.length > 1) {
          argumentTypes = argumentTypes.filter((t) => t !== 'undefined');
        }

        colon = '?:';
      }

      return `${argument.name}${colon} ${argumentTypes.map(this.getMapping()).join(' | ')}`;
    });
  }

  protected buildInterfaceAttribute(a: InterfaceAttributeDeclaration): string {
    let types = a.type;
    if (types.length > 1) {
      types = types.filter((t) => t !== 'undefined');
    }

    return `'${a.name}'${a.optional ? '?' : ''}: ${types.join(' | ')}`;
  }

  protected getMapping(): (s: string) => string {
    return (argumentType: string) => {
      let newType = argumentType;
      if (this.interfaceNames.indexOf(newType) !== -1) {
        if (this.exportNamespace !== '') {
          newType = this.exportNamespace + '.' + newType;
        }
      }

      return newType;
    };
  }
}
