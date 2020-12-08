import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { DTS } from '../ast/types';
import { emit } from '../ts-ast-utils/utils';
import { buildAst } from '../ast/buildAst';
import { createDTSClass } from './dts/createDTSClass';
import { createDTSNamespace } from './dts/createDTSNamespace';

export class ModuleClassTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  protected doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    const dtsFile: DTS = {
      exportAssignment: this.exportNamespace,
      classes: typescriptModuleDeclaration.classes[0] && [
        { ...createDTSClass(typescriptModuleDeclaration.classes[0]), export: false },
      ],
      namespace: createDTSNamespace(
        {
          interfaces: typescriptModuleDeclaration.interfaces,
          classes: typescriptModuleDeclaration.classes.slice(1),
          functions: typescriptModuleDeclaration.methods,
        },
        this.exportNamespace,
      ),
    };

    this.fileContents = emit(buildAst(dtsFile));
  }

  protected getExportedName(
    typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration,
  ): string {
    return typescriptModuleDeclaration.classes[0].name;
  }
}
