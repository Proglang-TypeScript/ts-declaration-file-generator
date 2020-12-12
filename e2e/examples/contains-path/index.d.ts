export = ContainsPath;
declare function ContainsPath(
  filepath: string,
  substr: string,
  options?: ContainsPath.I__options,
): boolean;
declare namespace ContainsPath {
  export interface I__options {
    nocase?: boolean;
    partialMatch?: undefined;
  }
}
