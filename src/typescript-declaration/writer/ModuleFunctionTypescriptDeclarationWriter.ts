import { BaseTypescriptDeclarationWriter } from './BaseTypescriptDeclarationWriter';
import { BaseTemplateTypescriptDeclaration } from '../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import { buildAst } from '../ast/buildAst';
import { DTS } from '../ast/types';
import { emit } from '../ts-ast-utils/utils';
import { createDTSProperty } from './dts/createDTSProperty';

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
        })),
      namespace: {
        name: this.getExportedName(typescriptModuleDeclaration),
        interfaces: typescriptModuleDeclaration.interfaces.map((interfaceDeclaration) => ({
          name: interfaceDeclaration.name,
          properties: interfaceDeclaration.getAttributes().map((attributeDeclaration) =>
            createDTSProperty({
              name: attributeDeclaration.name,
              getTypeOfs() {
                return attributeDeclaration.type;
              },
              isOptional() {
                return attributeDeclaration.optional === true;
              },
            }),
          ),
        })),
        classes: typescriptModuleDeclaration.classes.map((c) => ({
          name: c.name,
          constructors: [
            {
              parameters: c.constructorMethod
                .getArguments()
                .map((argument) => createDTSProperty(argument)),
            },
          ],
          methods: c.getMethods().map((method) => ({
            name: method.name,
            parameters: method.getArguments().map((argument) => createDTSProperty(argument)),
          })),
        })),
      },
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
