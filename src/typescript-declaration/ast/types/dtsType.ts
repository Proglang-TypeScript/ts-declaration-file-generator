export type DTSType =
  | DTSTypeKeyword
  | DTSTypeLiteralType
  | DTSTypeUnion
  | DTSTypeReference
  | DTSTypeArray;

interface BaseType {
  kind: DTSTypeKinds;
  value: unknown;
}

export const enum DTSTypeKinds {
  KEYWORD,
  LITERAL_TYPE,
  UNION,
  TYPE_REFERENCE,
  ARRAY,
}

export interface DTSTypeKeyword extends BaseType {
  kind: DTSTypeKinds.KEYWORD;
  value: DTSTypeKeywords;
}

export const enum DTSTypeKeywords {
  VOID,
  STRING,
  NUMBER,
  ANY,
  UNKNOWN,
  BOOLEAN,
  UNDEFINED,
  NULL,
  OBJECT,
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
  value: {
    referenceName: string;
    namespace?: string;
  };
}

export interface DTSTypeArray extends BaseType {
  kind: DTSTypeKinds.ARRAY;
  value: DTSType;
}
