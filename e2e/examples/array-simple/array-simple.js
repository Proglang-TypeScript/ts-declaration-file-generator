module.exports = function (a) {
  var i = 0;
  for (var index = 0; index < a.length; index++) {
    i += a[index];
  }

  i += a.length;

  return i;
};
