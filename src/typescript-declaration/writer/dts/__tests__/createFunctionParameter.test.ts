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
});
