const jwt = require("jsonwebtoken");
const config = require("config");
const {
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
} = require("../consts/errors");

const authAdmin = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Decode JWT from token
    const decoded = jwt.decode(token, config.get("jwtKey"));
    // Verrify the id is correct
    if (decoded && decoded.admin && decoded.admin.id) {
      req.admin = decoded.admin;
      next();
    } else {
      return res.json(401).json(UNAUTHORIZED_ACCESS);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  authAdmin,
};
