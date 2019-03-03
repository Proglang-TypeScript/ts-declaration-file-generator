Calculator = function() {
    this.sum = function(a, b) {
        return a + b;
    };
};

var calculator = new Calculator();

calculator.sum(1, 2);