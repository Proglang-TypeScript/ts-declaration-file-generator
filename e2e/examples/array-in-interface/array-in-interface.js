module.exports = function (a) {
  var sum = 0;

  if (a.value && a.value.length > 0) {
    for (var i = 0; i < a.value.length; i++) {
      var element = a.value[i];
      sum += element;
    }
  }

  sum += a.anotherAttribute.length;

  return sum;
};
