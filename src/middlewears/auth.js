const jwt = require("jsonwebtoken");
const config = require("config");
const { INTERNAL_SERVER_ERROR, INVALID_TOKEN } = require("../consts/errors");
const mongoose = require("mongoose");

const authAdminOrUser = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Decode JWT token
    try {
      const { admin, user } = jwt.decode(token, config.get("jwtKey"));
      if (admin) {
        req.admin = admin;
        next();
      } else if (user) {
        req.user = user;
        next();
      } else {
        return res.status(400).json(INVALID_TOKEN);
      }
    } catch (e) {
      return res.status(400).json(INVALID_TOKEN);
    }
  } catch (err) {
    return res.status(400).json(INVALID_TOKEN);
  }
};
const authAdmin = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Decode JWT token
    try {
      const { admin } = jwt.decode(token, config.get("jwtKey"));
      // Verrify the id is correct
      if (!admin || !mongoose.Types.ObjectId.isValid(admin.id)) {
        return res.status(400).json(INVALID_TOKEN);
      }

      req.admin = admin;
      next();
    } catch (e) {
      return res.status(400).json(INVALID_TOKEN);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const authUser = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Decode JWT from token
    try {
      const { user } = jwt.decode(token, config.get("jwtKey"));
      // Verrify the id is correct
      if (!user || !mongoose.Types.ObjectId.isValid(user.id)) {
        return res.status(400).json(INVALID_TOKEN);
      }

      req.user = user;
      next();
    } catch (e) {
      return res.status(400).json(INVALID_TOKEN);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

// simillar to authUser but can allow guests to continue
const passGuests = async (req, res, next) => {
  try {
    // verify if token exists
    const token = req.header("x-auth-token");
    if (!token) {
      return next();
    }

    // Decode JWT from token
    try {
      const { user } = jwt.decode(token, config.get("jwtKey"));
      // Verrify the id is correct
      if (!user || !mongoose.Types.ObjectId.isValid(user.id)) {
        return res.status(400).json(INVALID_TOKEN);
      }

      req.user = user;
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
  authUser,
  authAdminOrUser,
  passGuests,
};
