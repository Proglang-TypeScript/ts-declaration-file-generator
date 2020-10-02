import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';

export class ModuleClassTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  protected doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    this.writeExportModule();
    this.writeClass(typescriptModuleDeclaration);
    this.openNamespace();
    this.writeInterfaces(typescriptModuleDeclaration);
    this.writeFunctions(typescriptModuleDeclaration);
    this.closeNamespace();
  }

  protected getExportedName(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  ): string {
    return typescriptModuleDeclaration.classes[0].name;
  }

  private writeClass(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    const classDeclaration = typescriptModuleDeclaration.classes[0];

    this.fileContents += 'declare class ' + classDeclaration.name + ' {\n';
    this.fileContents +=
      '\t' + this.getConstructorSignature(classDeclaration.constructorMethod) + ';\n';

    classDeclaration.getMethods().forEach((m) => {
      this.fileContents += '\t' + this.getFunctionNameWithTypes(m) + ';\n';
    });

    this.fileContents += '}\n\n';
  }

  private writeInterfaces(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    typescriptModuleDeclaration.interfaces.forEach((i) => {
      this.fileContents += '\texport interface ' + i.name + ' {\n';

      i.getAttributes().forEach((a) => {
        this.fileContents += `\t\t${this.buildInterfaceAttribute(a)};\n`;
      });

      i.methods.forEach((m) => {
        this.fileContents += '\t\t' + this.getFunctionNameWithTypes(m) + ';\n';
      });

      this.fileContents += '\t}\n\n';
    });
  }

  private writeFunctions(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    typescriptModuleDeclaration.methods.forEach((functionDeclaration) => {
      this.fileContents +=
        'export function ' + this.getFunctionNameWithTypes(functionDeclaration) + ';\n';
    });
  }
}
