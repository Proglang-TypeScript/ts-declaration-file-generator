import { DTSFunction } from './dtsFunction';

export type DTSType =
  | DTSTypeKeyword
  | DTSTypeLiteralType
  | DTSTypeUnion
  | DTSTypeInterface
  | DTSTypeReference
  | DTSTypeArray
  | DTSTypeFunction;

interface BaseType {
  kind: DTSTypeKinds;
  value: unknown;
}

export const enum DTSTypeKinds {
  KEYWORD = 'KEYWORD',
  LITERAL_TYPE = 'LITERAL_TYPE',
  UNION = 'UNION',
  ARRAY = 'ARRAY',
  INTERFACE = 'INTERFACE',
  TYPE_REFERENCE = 'TYPE_REFERENCE',
  FUNCTION = 'FUNCTION',
}

export interface DTSTypeKeyword extends BaseType {
  kind: DTSTypeKinds.KEYWORD;
  value: DTSTypeKeywords;
}

export const enum DTSTypeKeywords {
  VOID = 'VOID',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  ANY = 'ANY',
  UNKNOWN = 'UNKNOWN',
  BOOLEAN = 'BOOLEAN',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  OBJECT = 'OBJECT',
}

export interface DTSTypeLiteralType extends BaseType {
  kind: DTSTypeKinds.LITERAL_TYPE;
  value: number | string | boolean;
}

export interface DTSTypeUnion extends BaseType {
  kind: DTSTypeKinds.UNION;
  value: DTSType[];
}

export interface DTSTypeReference extends BaseType {
  kind: DTSTypeKinds.TYPE_REFERENCE;
  value: string;
}

export interface DTSTypeInterface extends BaseType {
  kind: DTSTypeKinds.INTERFACE;
  value: string;
}

export interface DTSTypeArray extends BaseType {
  kind: DTSTypeKinds.ARRAY;
  value: DTSType;
}

export interface DTSTypeFunction extends BaseType {
  kind: DTSTypeKinds.FUNCTION;
  value: DTSFunction;
}
