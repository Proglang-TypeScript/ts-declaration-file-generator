var addZero = require('add-zero');

addZero(5); // 05
addZero(10); // 10
addZero(5, 3); // 005
addZero(100, 3); // 100
addZero(-5); // -05
addZero(-5, 3); // -005
