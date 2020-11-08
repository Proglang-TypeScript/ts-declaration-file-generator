import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { buildAst } from '../ast/buildAst';
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../ast/types';
import { emit } from '../ts-ast-utils/utils';
import { FunctionDeclaration } from '../FunctionDeclaration';
import { DTSProperty } from '../ast/types/dtsProperty';

export class ModuleFunctionTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  protected doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    const dtsFile: DTS = {
      exportAssignment: this.getExportedName(typescriptModuleDeclaration),
      functions: typescriptModuleDeclaration.methods
        .filter((t) => t.isExported === true)
        .map(() => ({
          name: this.getExportedName(typescriptModuleDeclaration),
          export: false,
        })),
    };

    this.fileContents = emit(buildAst(dtsFile));
  }

  protected getExportedName(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  ): string {
    const n = typescriptModuleDeclaration.module.replace(/([-_][a-z])/gi, ($1: string) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });

    return n.charAt(0).toUpperCase() + n.slice(1);
  }

  private writeFunction(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    const exportedFunctionDeclarations = typescriptModuleDeclaration.methods.filter(
      (t) => t.isExported === true,
    );

    exportedFunctionDeclarations.forEach((exportedFunctionDeclaration) => {
      exportedFunctionDeclaration.name = this.exportNamespace;

      this.fileContents +=
        'declare function ' + this.getFunctionNameWithTypes(exportedFunctionDeclaration) + ';\n';
    });
  }

  private writeFunctions(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    typescriptModuleDeclaration.methods
      .filter((t) => t.isExported !== true)
      .forEach((innerNotExportedFunction) => {
        this.fileContents +=
          '\texport function ' + this.getFunctionNameWithTypes(innerNotExportedFunction) + ';\n';
      });
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

  private writeClasses(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration): void {
    typescriptModuleDeclaration.classes.forEach((classDeclaration) => {
      this.fileContents += '\texport class ' + classDeclaration.name + ' {\n';

      this.fileContents +=
        '\t\t' + this.getConstructorSignature(classDeclaration.constructorMethod) + ';\n';

      classDeclaration.getMethods().forEach((m) => {
        this.fileContents += '\t\t' + this.getFunctionNameWithTypes(m) + ';\n';
      });

      this.fileContents += '\t}\n\n';
    });
  }

  private buildFunctionParameters(functionDeclaration: FunctionDeclaration): DTSProperty[] {
    return functionDeclaration.getArguments().map((argumentDeclaration) => {
      return {
        name: argumentDeclaration.name,
        optional: argumentDeclaration.isOptional(),
        type: {
          kind: DTSTypeKinds.KEYWORD,
          value: DTSTypeKeywords.STRING,
        },
      };
    });
  }
}
