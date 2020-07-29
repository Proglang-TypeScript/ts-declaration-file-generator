// This example corresponds to https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#use-union-types

var f = require("./union-type-function");

console.log(f());
console.log(f("123"));
console.log(f(123));