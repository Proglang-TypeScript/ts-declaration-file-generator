var Calculator = require('./calculator');

var calculator = new Calculator();

calculator.sum(1, 2);
calculator.sum(1, 2, {});
calculator.sum(1, 2, { hello: 1, world: 2 });

var anotherCalculator = new Calculator('anotherCalculator');
