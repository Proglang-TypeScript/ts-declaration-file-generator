import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { buildAst } from '../ast/buildAst';
import { DTS } from '../ast/types';
import { emit } from '../ts-ast-utils/utils';
import { createFunctionParameter } from './dts/createFunctionParameter';

export class ModuleFunctionTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  protected doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    const dtsFile: DTS = {
      exportAssignment: this.getExportedName(typescriptModuleDeclaration),
      functions: typescriptModuleDeclaration.methods
        .filter((method) => method.isExported === true)
        .map((method) => ({
          name: this.getExportedName(typescriptModuleDeclaration),
          export: false,
          parameters: method.getArguments().map((argument) => createFunctionParameter(argument)),
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
}
