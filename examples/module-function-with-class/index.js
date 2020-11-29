var f = require('./module-function-with-class');
var Foo = f.Foo;

var foo = new Foo('SomeName');
foo.doSomething();

console.log(f(123));
