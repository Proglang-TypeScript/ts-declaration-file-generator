export = CallbackSimple;
declare function CallbackSimple(a: CallbackSimple.I__a, cb: (((s: string) => number)) | (((s: string) => string))): string;
declare namespace CallbackSimple {
    export interface I__a {
        firstName: string;
        lastName: string;
    }
}
