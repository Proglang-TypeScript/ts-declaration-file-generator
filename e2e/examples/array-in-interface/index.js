var sum = require('./array-in-interface');

var a = {
  anotherAttribute: 'hello',
  value: [
    [1, 2, 3],
    [4, 5, 6],
  ],
};

console.log(sum(a));
