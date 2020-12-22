const jwt = require("jsonwebtoken");
const config = require("config");
const { INTERNAL_SERVER_ERROR, INVALID_TOKEN } = require("../consts/errors");

const authAdmin = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Decode JWT from token
    try {
      const decoded = jwt.decode(token, config.get("jwtKey"));
      // Verrify the id is correct
      req.admin = decoded.admin;
      next();
    } catch (e) {
      return res.status(400).json(INVALID_TOKEN);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  authAdmin,
};
