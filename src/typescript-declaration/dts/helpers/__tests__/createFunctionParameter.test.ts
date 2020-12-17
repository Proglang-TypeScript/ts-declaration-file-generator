import ArgumentDeclaration from '../../../builder/ArgumentDeclaration';
import { createDTSProperty } from '../createDTSProperty';
import { DTSProperty } from '../../../ast/types/dtsProperty';
import { DTSTypeKinds, DTSTypeKeywords } from '../../../ast/types';

describe('createDTSProperty', () => {
  it('creates the parameter from an argument', () => {
    const a = new ArgumentDeclaration(0, 'a');
    ['string', 'number'].map((type) => a.addTypeOf(type));

    const parameter: DTSProperty = {
      name: 'a',
      optional: false,
      type: {
        kind: DTSTypeKinds.UNION,
        value: [
          {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
          {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.STRING,
          },
        ],
      },
    };

    expect(createDTSProperty(a)).toStrictEqual(parameter);
  });

  it('ignores the `undefined` type if there are other types', () => {
    const a = new ArgumentDeclaration(0, 'a');
    ['undefined', 'string'].map((type) => a.addTypeOf(type));

    const parameter: DTSProperty = {
      name: 'a',
      optional: true,
      type: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.STRING,
      },
    };

    expect(createDTSProperty(a)).toStrictEqual(parameter);
  });

  it('does not ignore the `undefined` type if there is no other type', () => {
    const a = new ArgumentDeclaration(0, 'a');
    ['undefined'].map((type) => a.addTypeOf(type));

    const parameter: DTSProperty = {
      name: 'a',
      optional: true,
      type: {
        kind: DTSTypeKinds.KEYWORD,
        value: DTSTypeKeywords.UNDEFINED,
      },
    };

    expect(createDTSProperty(a)).toStrictEqual(parameter);
  });
});
