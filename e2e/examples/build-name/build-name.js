var buildName = function (firstName, lastName) {
  if (lastName) return firstName + ' ' + lastName;
  else return firstName;
};

module.exports = buildName;
