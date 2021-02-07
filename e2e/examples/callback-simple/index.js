// eslint-disable-next-line @typescript-eslint/no-var-requires
var c = require('./callback-simple');

c({ firstName: 'John', lastName: 'Doe' }, function (s) {
  return s.toUpperCase();
});

// 'JOHN DOE'

c({ firstName: 'John', lastName: 'Doe' }, function (s) {
  return s.length;
});

// '4 3'
