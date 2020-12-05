import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { buildAst } from '../ast/buildAst';
import { DTS, DTSNamespace } from '../ast/types';
import { emit } from '../ts-ast-utils/utils';
import { createDTSProperty } from './dts/createDTSProperty';
import { createDTSType } from './dts/createDTSType';
import { createDTSInterface } from './dts/createDTSInterface';
import { createDTSClass } from './dts/createDTSClass';

export class ModuleFunctionTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  protected doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    const dtsFile: DTS = {
      exportAssignment: this.getExportedName(typescriptModuleDeclaration),
      functions: typescriptModuleDeclaration.methods
        .filter((method) => method.isExported === true)
        .map((method) => ({
          name: this.getExportedName(typescriptModuleDeclaration),
          export: false,
          parameters: method.getArguments().map((argument) => createDTSProperty(argument)),
          returnType: createDTSType(method.getReturnTypeOfs()),
        })),
      namespace: this.getNamespace(typescriptModuleDeclaration),
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

  private getNamespace(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  ): DTSNamespace | undefined {
    const interfaces = typescriptModuleDeclaration.interfaces;
    const classes = typescriptModuleDeclaration.classes;

    if (interfaces.length === 0 && classes.length === 0) {
      return undefined;
    }

    return {
      name: this.getExportedName(typescriptModuleDeclaration),
      interfaces: interfaces.map((interfaceDeclaration) =>
        createDTSInterface(interfaceDeclaration),
      ),
      classes: classes.map((c) => createDTSClass(c)),
    };
  }
}
