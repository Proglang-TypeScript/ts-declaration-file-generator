export = StringManipulatorExtraProperties;
declare function StringManipulatorExtraProperties(
  s: string | StringManipulatorExtraProperties.I__s,
): number;
declare namespace StringManipulatorExtraProperties {
  export interface I__s {
    somethingNotInString?: undefined;
    anotherProperty?: undefined;
    length: number;
  }
}
