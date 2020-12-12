export = Calculator;
declare class Calculator {
  constructor(calculatorName: string);
  sum(a: number, b: number, optionalParameter?: Calculator.I__optionalParameter): number;
}
declare namespace Calculator {
  export interface I__optionalParameter {
    hello?: number;
    world: number;
  }
}
