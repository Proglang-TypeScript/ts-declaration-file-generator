export = ArrayManipulator;
declare function ArrayManipulator(a: (string | ArrayManipulator.I__a_element)[]): number;
declare namespace ArrayManipulator {
  export interface I__something {
    somethingElse: number;
  }
  export interface I__a_element {
    hello?: string;
    world?: string;
    something?: ArrayManipulator.I__something;
  }
}
