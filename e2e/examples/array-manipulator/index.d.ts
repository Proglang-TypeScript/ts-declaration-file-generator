export = ArrayManipulator;
declare function ArrayManipulator(a: (number | string | ArrayManipulator.I__a)[]): number;
declare namespace ArrayManipulator {
  export interface I__something {
    somethingElse: number;
  }
  export interface I__a {
    hello?: string;
    world?: string;
    something: object | ArrayManipulator.I__something;
  }
}
