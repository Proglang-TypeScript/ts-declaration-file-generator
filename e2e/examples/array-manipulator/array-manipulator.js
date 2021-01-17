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

  return i;
};
