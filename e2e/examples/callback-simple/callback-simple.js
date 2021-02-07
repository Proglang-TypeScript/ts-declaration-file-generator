module.exports = function (a, cb) {
  return cb(a.firstName) + ' ' + cb(a.lastName);
};
