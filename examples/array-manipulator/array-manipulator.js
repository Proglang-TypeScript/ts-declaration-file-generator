module.exports = function (a) {
  var i = 0;
  for (var index = 0; index < a.length; index++) {
    var element = a[index];
    if (element.hello && element.world) {
      if (element.something && element.something.somethingElse) {
        i++;
      }
      i++;
    }
  }

  a.forEach(function (element) {
    if (element.anotherProperty === 'some-value') {
      i++;
    }
  });

  if (a.someOtherProperty === 123) {
    i++;
  }

  return i;
};
