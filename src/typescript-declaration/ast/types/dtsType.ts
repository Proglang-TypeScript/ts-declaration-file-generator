export type DTSType = DTSTypeKeyword | DTSTypeLiteralType;

interface BaseType {
  kind: DTSTypeKinds;
  value: unknown;
}

export const enum DTSTypeKinds {
  KEYWORD,
  LITERAL_TYPE,
}

export interface DTSTypeKeyword extends BaseType {
  kind: DTSTypeKinds.KEYWORD;
  value: DTSKeywords;
}

export const enum DTSKeywords {
  VOID,
  STRING,
  NUMBER,
  ANY,
  UNKNOWN,
}

export interface DTSTypeLiteralType extends BaseType {
  kind: DTSTypeKinds.LITERAL_TYPE;
  value: string;
}
