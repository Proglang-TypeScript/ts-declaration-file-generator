import { DTSProperty } from '../types/dtsProperty';
import ts from 'typescript';
import { createTypeNode } from './createTypeNode';
import { DTS } from '../types';

export const createParameter = (
  dtsParameter: DTSProperty,
  context?: DTS,
): ts.ParameterDeclaration => {
  return ts.createParameter(
    undefined,
    undefined,
    undefined,
    dtsParameter.name,
    dtsParameter.optional === true ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    createTypeNode(dtsParameter.type, context),
    undefined,
  );
};
