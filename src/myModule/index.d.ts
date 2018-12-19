export = myModule
declare namespace myModule {
    export interface StringValidator {
		isAcceptable(s: string): boolean;
		hello: string;
    }

	export function someValueLessThan100(myObj: string|object): boolean
	export function variableValueLessThan100(myObj: object, key: string): boolean
}