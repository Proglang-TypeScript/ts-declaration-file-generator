import ArgumentDeclaration from '../../../ArgumentDeclaration';
import { createFunctionParameter } from '../createFunctionParameter';
import { DTSProperty } from '../../../ast/types/dtsProperty';
import { DTSTypeKinds, DTSTypeKeywords } from '../../../ast/types';

describe('createFunctionParameter', () => {
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

    expect(createFunctionParameter(a)).toStrictEqual(parameter);
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

    expect(createFunctionParameter(a)).toStrictEqual(parameter);
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

    expect(createFunctionParameter(a)).toStrictEqual(parameter);
  });
});
