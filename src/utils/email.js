const jwt = require("jsonwebtoken");
const config = require("config");
t;
const generateEmailVerificationToken = (id) => {
  return jwt.sign({ id }, config.get("jwtKey"));
};

module.exports = {
  generateEmailVerificationToken,
};
