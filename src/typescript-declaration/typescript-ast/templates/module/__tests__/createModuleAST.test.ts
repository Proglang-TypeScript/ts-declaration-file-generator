import TemplateTypescriptDeclaration from '../../../../ModuleDeclaration/TemplateTypescriptDeclaration';
import { FunctionDeclaration } from '../../../../FunctionDeclaration';
import createModuleAST from '../createModuleAST';
import { emitAST, createAST } from '../../../utils';

describe('Create Module AST', () => {
  it('creates a module with 1 function without parameters', async () => {
    const declaration = new TemplateTypescriptDeclaration();

    const f = new FunctionDeclaration();
    f.name = 'foo';
    f.addReturnTypeOf('string');
    declaration.methods.push(f);
    const ast = createModuleAST(declaration);

    expect(emitAST(ast)).toBe(emitAST(createAST('export function foo(): void;')));
  });
});
