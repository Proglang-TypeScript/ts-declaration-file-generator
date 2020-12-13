import { DTSModifiers } from '../types';
import ts from 'typescript';

export const createModifiers = (modifiers: DTSModifiers[]): ts.Modifier[] => {
  return (
    modifiers.map((modifier) => {
      switch (modifier) {
        case DTSModifiers.EXPORT:
          return ts.createModifier(ts.SyntaxKind.ExportKeyword);

        case DTSModifiers.DECLARE:
          return ts.createModifier(ts.SyntaxKind.DeclareKeyword);
      }
    }) || []
  );
};
