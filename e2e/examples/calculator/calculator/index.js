module.exports = function (calculatorName) {
  this.calculatorName = calculatorName;

  this.sum = function (a, b, optionalParameter) {
    var n = a + b;
    if (optionalParameter && optionalParameter.hello && optionalParameter.world) {
      n = n * 2;
    }

    return n;
  };
};
