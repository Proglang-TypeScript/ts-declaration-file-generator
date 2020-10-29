import { DTSTypeKeywords, DTSTypeKinds, DTSType } from '../../types';
import { createTypeNode } from '../createTypeNode';
import { emit } from '../../../ts-ast-utils/utils';

describe('createTypeNode', () => {
  describe('keyword types', () => {
    it('creates a keyword type', () => {
      const keywords = new Map<DTSTypeKeywords, string>();
      keywords.set(DTSTypeKeywords.ANY, 'any');
      keywords.set(DTSTypeKeywords.NUMBER, 'number');
      keywords.set(DTSTypeKeywords.STRING, 'string');
      keywords.set(DTSTypeKeywords.UNKNOWN, 'unknown');
      keywords.set(DTSTypeKeywords.VOID, 'void');

      Array.from(keywords.keys()).forEach((keyword) => {
        const type: DTSType = {
          kind: DTSTypeKinds.KEYWORD,
          value: keyword,
        };

        const typeNode = createTypeNode(type);
        expect(emit(typeNode)).toBe(`${keywords.get(keyword)}`);
      });
    });
  });

  describe('literal types', () => {
    it('creates the string literal type', () => {
      const type: DTSType = {
        kind: DTSTypeKinds.LITERAL_TYPE,
        value: 'hello',
      };

      const typeNode = createTypeNode(type);
      expect(emit(typeNode)).toBe(`"hello"`);
    });

    it('creates the number literal type', () => {
      const type: DTSType = {
        kind: DTSTypeKinds.LITERAL_TYPE,
        value: 123.45,
      };

      const typeNode = createTypeNode(type);
      expect(emit(typeNode)).toBe(`123.45`);
    });

    it('creates the boolean literal type', () => {
      let type: DTSType = {
        kind: DTSTypeKinds.LITERAL_TYPE,
        value: false,
      };

      let typeNode = createTypeNode(type);
      expect(emit(typeNode)).toBe(`false`);

      type = {
        kind: DTSTypeKinds.LITERAL_TYPE,
        value: true,
      };

      typeNode = createTypeNode(type);
      expect(emit(typeNode)).toBe(`true`);
    });
  });

  describe('union type', () => {
    it('creates the union type', () => {
      const type: DTSType = {
        kind: DTSTypeKinds.UNION,
        value: [
          {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
          {
            kind: DTSTypeKinds.LITERAL_TYPE,
            value: 'hello',
          },
        ],
      };

      const typeNode = createTypeNode(type);
      expect(emit(typeNode)).toBe(`number | "hello"`);
    });
  });
});
