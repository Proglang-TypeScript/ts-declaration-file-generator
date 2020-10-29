export type DTSType = DTSTypeKeyword | DTSTypeLiteralType | DTSTypeUnion;

interface BaseType {
  kind: DTSTypeKinds;
  value: unknown;
}

export const enum DTSTypeKinds {
  KEYWORD,
  LITERAL_TYPE,
  UNION,
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
}

export interface DTSTypeLiteralType extends BaseType {
  kind: DTSTypeKinds.LITERAL_TYPE;
  value: number | string | boolean;
}

export interface DTSTypeUnion extends BaseType {
  kind: DTSTypeKinds.UNION;
  value: DTSType[];
}
