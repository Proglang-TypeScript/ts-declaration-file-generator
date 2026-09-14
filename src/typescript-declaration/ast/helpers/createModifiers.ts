import { DTSModifiers } from '../types';
import ts from 'typescript';

export const createModifiers = (modifiers: DTSModifiers[]): ts.Modifier[] => {
  return (
    modifiers.map((modifier) => {
      switch (modifier) {
        case DTSModifiers.EXPORT:
          return ts.factory.createModifier(ts.SyntaxKind.ExportKeyword);

        case DTSModifiers.DECLARE:
          return ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword);
      }
    }) || []
  );
};
