const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED_ACCESS,
  INVALID_CREDENTIALS,
  INVALID_TOKEN,
} = require("../../../consts/errors");
const { authAdmin } = require("../../../middlewears/auth");
const Admin = require("../../../models/Admin");
const mongoose = require("mongoose");

const router = Router();

// @Endpoint:     GET   /api/v1/auth/admin
// @Description   Get authentificated admin
// @Access        Private (admin)
router.get("/admin", authAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.admin.id)) {
      return res.status(400).json(INVALID_TOKEN);
    }
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(401).json(UNAUTHORIZED_ACCESS);
    }
    return res.json(admin);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
});

// @Endpoint:     GET   /api/v1/auth/user
// @Description   Get authentificated user
// @Access        Private
router.get("/user", async (req, res) => {
  res.send("Auth");
});

// @Endpoint:     POST   /api/v1/auth/admin/login
// @Description   Login admin
// @Access        Public
router.post(
  "/admin/login",
  [
    // TODO: Better validation
    check("username", "username is required").notEmpty(),
    check("password", "password is required").notEmpty(),
  ],
  async (req, res) => {
    try {
      // Check bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { username, password } = req.body;
      // Search Database for username
      const admin = await Admin.findOne({ username }).select("+password");
      if (!admin) {
        return res.status(400).json(INVALID_CREDENTIALS);
      }
      // Check if the password is correct
      if (!(await bcrypt.compare(password, admin.password))) {
        return res.status(400).json(INVALID_CREDENTIALS);
      }
      // Correct credentiels return admin info
      delete admin.get;
      return res.json(admin);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

// @Endpoint:     POST   /api/v1/auth/user/login
// @Description   Login user
// @Access        Public
router.post("/admin/login", async (req, res) => {
  res.send("Auth");
});
module.exports = router;
