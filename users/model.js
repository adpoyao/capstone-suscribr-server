'use strict';

const bcrypt = require('bcryptjs');
const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

function validatePassword (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = {
  hashPassword,
  validatePassword
};
