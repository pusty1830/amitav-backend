const bcrypt = require("bcryptjs");

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const comparePassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
