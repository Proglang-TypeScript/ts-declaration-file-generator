export = ArrayManipulator;
declare function ArrayManipulator(
  a: (string | ArrayManipulator.I__a_element)[] | ArrayManipulator.I__a,
): number;
declare namespace ArrayManipulator {
  export interface I__something {
    somethingElse: number;
  }
  export interface I__a_element {
    hello?: string;
    world?: string;
    something: object | ArrayManipulator.I__something;
  }
  export interface I__a {
    someOtherProperty?: undefined;
  }
}
