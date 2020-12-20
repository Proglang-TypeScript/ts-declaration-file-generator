import { FunctionDeclaration } from '../FunctionDeclaration';
import { createString, createNumber } from '../../dts/helpers/createDTSType';

describe('FunctionDeclaration', () => {
  it('ignores duplicates returnTypeOfs', () => {
    const functionDeclaration = new FunctionDeclaration();
    functionDeclaration.addReturnTypeOf(createString());
    functionDeclaration.addReturnTypeOf(createNumber());
    functionDeclaration.addReturnTypeOf(createString());

    const returnTypeOfs = functionDeclaration.getReturnTypeOfs();
    expect(returnTypeOfs).toHaveLength(2);
    expect(returnTypeOfs[0]).toStrictEqual(createString());
    expect(returnTypeOfs[1]).toStrictEqual(createNumber());
  });
});
