module.exports = function (a) {
  var sum = 0;

  for (var i = 0; i < a.length; i++) {
    var element = a[i];
    for (var j = 0; j < element.length; j++) {
      sum += element[j];
    }
  }

  return sum;
};
