module.exports = function (a) {
  var sum = 0;

  if (a.value && a.value.length > 0) {
    for (var i = 0; i < a.value.length; i++) {
      var element = a.value[i];
      for (var j = 0; j < element.length; j++) {
        sum += element[j];
      }
    }
  }

  sum += a.anotherAttribute.length;

  return sum;
};
