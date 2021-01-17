var a = require('./array-manipulator');

a([
  { hello: 'hello', world: 'world' },
  { hello: 'hello', world: 'world', something: { somethingElse: 123 } },
  { hello: 'hello' },
  '123',
]);
