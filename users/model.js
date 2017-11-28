'use strict';

const bcrypt = require('bcryptjs');
const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

function validatePassword (password, hashpass) {
  return bcrypt.compare(password, hashpass);
}

module.exports = {
  hashPassword,
  validatePassword
};

//add apiRepr function