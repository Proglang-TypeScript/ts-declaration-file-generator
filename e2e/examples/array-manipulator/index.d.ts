export = ArrayManipulator;
declare function ArrayManipulator(a: any[] | ArrayManipulator.I__a): number;
declare namespace ArrayManipulator {
  export interface I__0 {
    hello?: undefined;
  }
  export interface I__something {
    somethingElse: number;
  }
  export interface I__1 {
    hello: string;
    world: string;
    something: object | ArrayManipulator.I__something;
  }
  export interface I__2 {
    world?: undefined;
  }
  export interface I__a {
    length: number;
    0: ArrayManipulator.I__0;
    1: ArrayManipulator.I__1;
    2: ArrayManipulator.I__2;
    3: string;
    someOtherProperty?: undefined;
  }
}
