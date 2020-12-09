import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { DTS } from '../ast/types';
import { createDTSClass } from './dts/createDTSClass';
import { emit } from '../ts-ast-utils/utils';
import { buildAst } from '../ast/buildAst';
import { createDTSFunction } from './dts/createDTSFunction';
import { createDTSInterface } from './dts/createDTSInterface';

export class ModuleTypescriptDeclarationWriter extends BaseTypescriptDeclarationWriter {
  doWrite(typescriptModuleDeclaration: BaseTemplateTypescriptDeclaration) {
    const dtsFile: DTS = {
      classes: typescriptModuleDeclaration.classes.map((c) => createDTSClass(c)),
      functions: typescriptModuleDeclaration.methods.map((m) => createDTSFunction(m)),
      interfaces: typescriptModuleDeclaration.interfaces.map((i) => createDTSInterface(i)),
    };

    this.fileContents = emit(buildAst(dtsFile));
  }

  protected getExportedName(): string {
    return '';
  }
}
