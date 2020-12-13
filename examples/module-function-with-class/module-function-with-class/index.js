var myFunction = function (someNumber) {
  return someNumber + 1;
};

myFunction.Foo = function (name) {
  this.name = name;

  this.doSomething = function () {
    return name.toUpperCase();
  };
};

module.exports = myFunction;
