var myModule = require('./my-module');

myModule.doSomething({ hello: "hello" });
myModule.doSomething({hello: "hello"}, true);
myModule.doSomething({world: "world"});
myModule.doSomething({ world: "world" }, true);
myModule.doAnotherThing(123);