import { InterfaceDeclaration } from '../../builder/InterfaceDeclaration';
import { createDTSProperty } from './createDTSProperty';
import { DTSInterface } from '../../ast/types';

export const createDTSInterface = (interfaceDeclaration: InterfaceDeclaration): DTSInterface => ({
  name: interfaceDeclaration.name,
  properties: interfaceDeclaration
    .getAttributes()
    .map((attributeDeclaration) => createDTSProperty(attributeDeclaration)),
});
