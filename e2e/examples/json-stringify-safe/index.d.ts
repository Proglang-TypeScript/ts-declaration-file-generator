export = JsonStringifySafe;
declare function JsonStringifySafe(
  obj: object,
  replacer: null,
  spaces: number,
  cycleReplacer?: undefined,
): string;
declare namespace JsonStringifySafe {
  export function serializer(replacer: null, cycleReplacer?: undefined): Function;
}
