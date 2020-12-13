import { FunctionDeclarationCleaner } from '../FunctionDeclarationCleaner';
import { FunctionDeclaration } from '../../typescript-declaration/FunctionDeclaration';
import ArgumentDeclaration from '../../typescript-declaration/ArgumentDeclaration';

describe('FunctionDeclarationCleaner', () => {
  describe('UnionTypes', () => {
    it('should unify argument types when the return type is the same', () => {
      const cleaner = new FunctionDeclarationCleaner();

      const function1 = new FunctionDeclaration();
      function1.name = 'MyFunction';
      function1.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('number'));
      function1.addReturnTypeOf('string');

      const function2 = new FunctionDeclaration();
      function2.name = 'MyFunction';
      function2.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('string'));
      function2.addReturnTypeOf('string');

      const function3 = new FunctionDeclaration();
      function3.name = 'MyFunction';
      function3.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('boolean'));
      function3.addReturnTypeOf('number');

      const functions = [function1, function2, function3];

      const expectedFunction = new FunctionDeclaration();
      expectedFunction.name = 'MyFunction';
      expectedFunction.addArgument(
        new ArgumentDeclaration(0, 'a').addTypeOf('string').addTypeOf('number'),
      );
      expectedFunction.addReturnTypeOf('string');

      const cleanedFunctions = cleaner.clean(functions);
      expect(cleanedFunctions).toContainEqual(expectedFunction);
      expect(cleanedFunctions).toContainEqual(function3);
      expect(cleanedFunctions).toHaveLength(2);
    });

    it('should not modifiy functions with only one return type', () => {
      const cleaner = new FunctionDeclarationCleaner();

      const function1 = new FunctionDeclaration();
      function1.name = 'MyFunction';
      function1.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('number'));
      function1.addReturnTypeOf('string');

      const function2 = new FunctionDeclaration();
      function2.name = 'MyFunction';
      function2.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('string'));
      function2.addReturnTypeOf('string');

      const functionWithOtherName = new FunctionDeclaration();
      functionWithOtherName.name = 'MyOtherFunction';
      functionWithOtherName.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('string'));
      functionWithOtherName.addReturnTypeOf('string');

      const functions = [function1, function2, functionWithOtherName];

      const expectedFunction = new FunctionDeclaration();
      expectedFunction.name = 'MyFunction';
      expectedFunction.addArgument(
        new ArgumentDeclaration(0, 'a').addTypeOf('string').addTypeOf('number'),
      );
      expectedFunction.addReturnTypeOf('string');

      const cleanedFunctions = cleaner.clean(functions);
      expect(cleanedFunctions).toContainEqual(expectedFunction);
      expect(cleanedFunctions).toContainEqual(functionWithOtherName);
      expect(cleanedFunctions).toHaveLength(2);
    });

    it('should make argument optional if it is unified against the undefined type', () => {
      const cleaner = new FunctionDeclarationCleaner();

      const function1 = new FunctionDeclaration();
      function1.name = 'MyFunction';
      function1.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('number'));
      function1.addReturnTypeOf('string');

      const function2 = new FunctionDeclaration();
      function2.name = 'MyFunction';
      function2.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('string'));
      function2.addReturnTypeOf('string');

      const function3 = new FunctionDeclaration();
      function3.name = 'MyFunction';
      function3.addArgument(new ArgumentDeclaration(0, 'a').addTypeOf('undefined'));
      function3.addReturnTypeOf('string');

      const functions = [function1, function2, function3];

      const expectedFunction = new FunctionDeclaration();
      expectedFunction.name = 'MyFunction';
      expectedFunction.addArgument(
        new ArgumentDeclaration(0, 'a').addTypeOf('string').addTypeOf('number').makeOptional(),
      );
      expectedFunction.addReturnTypeOf('string');

      const cleanedFunctions = cleaner.clean(functions);
      expect(cleanedFunctions).toContainEqual(expectedFunction);
      expect(cleanedFunctions).toHaveLength(1);
    });
  });
});
