// eslint-disable-next-line @typescript-eslint/no-var-requires
var c = require('./callback-interface');

c({ callbackItem: { firstName: 'John', lastName: 'Doe' } }, function (callbackItem) {
  return callbackItem.firstName + ' ' + callbackItem.lastName;
});

// 'John Doe'
