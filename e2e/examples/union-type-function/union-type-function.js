module.exports = function (a) {
  if (a === undefined) {
    return 123;
  }

  if (typeof a === 'string' || typeof a === 'number') {
    return true;
  }

  throw Error('Type not supported');
};
