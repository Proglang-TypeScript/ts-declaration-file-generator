export = CallbackInterface;
declare function CallbackInterface(a: CallbackInterface.I__a, cb: ((callbackItem: I__callbackItem) => string)): string;
declare namespace CallbackInterface {
    export interface I__a {
        callbackItem: object;
    }
    export interface I__callbackItem {
        firstName: string;
        lastName: string;
    }
}
