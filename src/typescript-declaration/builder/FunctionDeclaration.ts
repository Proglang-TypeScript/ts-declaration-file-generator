import ArgumentDeclaration from './ArgumentDeclaration';
import { DTSType } from '../ast/types';
import objectHash from 'object-hash';

export class FunctionDeclaration {
  name = '';
  isExported = false;
  private arguments: ArgumentDeclaration[] = [];
  private returnTypeOfs = new Map<string, DTSType>();

  addArgument(a: ArgumentDeclaration) {
    this.arguments.push(a);
  }

  addReturnTypeOf(returnTypeOf: DTSType) {
    this.returnTypeOfs.set(objectHash(returnTypeOf), returnTypeOf);
  }

  getReturnTypeOfs(): DTSType[] {
    return Array.from(this.returnTypeOfs.values()).sort((a, b) => {
      const [hashA, hashB] = [objectHash(a), objectHash(b)];

      if (hashA < hashB) {
        return -1;
      }

      if (hashA > hashB) {
        return 1;
      }

      return 0;
    });
  }

  getArguments(): ArgumentDeclaration[] {
    return this.arguments;
  }
}
