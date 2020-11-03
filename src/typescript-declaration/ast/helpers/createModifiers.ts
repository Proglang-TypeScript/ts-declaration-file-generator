import { DTSFunctionModifiers } from '../types';
import ts from 'typescript';

export const createModifiers = (modifiers: DTSFunctionModifiers[]): ts.Modifier[] => {
  return (
    modifiers.map((modifier) => {
      switch (modifier) {
        case DTSFunctionModifiers.EXPORT:
          return ts.createModifier(ts.SyntaxKind.ExportKeyword);

        case DTSFunctionModifiers.DECLARE:
          return ts.createModifier(ts.SyntaxKind.DeclareKeyword);
      }
    }) || []
  );
};
