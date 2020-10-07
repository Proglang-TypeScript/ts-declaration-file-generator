import { BaseTemplateTypescriptDeclaration } from '../../../ModuleDeclaration/BaseTemplateTypescriptDeclaration';
import ts from 'typescript';

export default function createModuleAST(
  typescriptDeclaration: BaseTemplateTypescriptDeclaration,
): ts.Node {
  const declarationFile = ts.createSourceFile(
    'module-ast.d.ts',
    '',
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS,
  );

  declarationFile.statements = (typescriptDeclaration.methods.map((method) =>
    ts.createFunctionDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      undefined,
      ts.createIdentifier(method.name),
      undefined,
      [],
      ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      undefined,
    ),
  ) as unknown) as ts.NodeArray<ts.Statement>;

  return declarationFile;
}
