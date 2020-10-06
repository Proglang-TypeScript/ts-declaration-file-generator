import { FunctionDeclaration } from '../FunctionDeclaration';

describe('FunctionDeclaration', () => {
  it('ignores duplicates returnTypeOfs', () => {
    const functionDeclaration = new FunctionDeclaration();
    functionDeclaration.addReturnTypeOf('string');
    functionDeclaration.addReturnTypeOf('number');
    functionDeclaration.addReturnTypeOf('string');

    const returnTypeOfs = functionDeclaration.getReturnTypeOfs();
    expect(returnTypeOfs).toHaveLength(2);
    expect(returnTypeOfs[0]).toBe('string');
    expect(returnTypeOfs[1]).toBe('number');
  });
});
