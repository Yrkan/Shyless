const { Router } = require("express");
const mongoose = require("mongoose");

const router = Router();
const Admin = require("../../../models/Admin");
const { authAdmin } = require("../../../middlewears/auth");
const {
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
  USERNAME_ALREADY_IN_USE,
  EMAIL_ALREADY_IN_USE,
  INVALID_ID,
} = require("../../../consts/errors");
const { check, validationResult } = require("express-validator");
const { cryptPassword } = require("../../../utils/crypto");

// @Endpoint:     GET   /api/v1/admins/
// @Description   Get a list of admins
// @Access        Private (superAdmin only)
router.get("/", authAdmin, async (req, res) => {
  try {
    // validate the admin id
    if (!mongoose.Types.ObjectId.isValid(req.admin.id)) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // check if the logged admin is a superadmin
    const loggedAdmin = await Admin.findById(req.admin.id);
    if (!loggedAdmin) {
      return res.status(400).json(INVALID_TOKEN);
    }
    if (!loggedAdmin.permissions.super_admin) {
      return res.status(401).json(UNAUTHORIZED_ACCESS);
    }

    // return list of admins infos
    const adminsList = await Admin.find({});
    return res.json(adminsList);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
});

// @Endpoint:     GET   /api/v1/admins/:id
// @Description   Get a single admin information
// @Access        Private (superAdmin + Owner admin)
router.get("/:id", authAdmin, async (req, res) => {
  try {
    // validate the admin id
    if (!mongoose.Types.ObjectId.isValid(req.admin.id)) {
      return res.status(400).json(INVALID_TOKEN);
    }
    // check if the logged admin is a superadmin or the ownerAdmin
    const loggedAdmin = await Admin.findById(req.admin.id);
    if (!loggedAdmin) {
      return res.status(400).json(INVALID_TOKEN);
    }
    if (
      !(loggedAdmin.permissions.super_admin || loggedAdmin.id === req.params.id)
    ) {
      return res.status(401).json(UNAUTHORIZED_ACCESS);
    }

    // authorized return information
    const adminInfo = await Admin.findById(req.params.id);
    if (!adminInfo) {
      return res.status(400).json(INVALID_ID);
    }
    return res.json(adminInfo);
  } catch (err) {
    console.error(err.message);
    return res.status(500).JSON(INTERNAL_SERVER_ERROR);
  }
});

// @Endpoint:     POST   /api/v1/admins/
// @Description   Create a new admin
// @Access        Private (superAdmin only)
router.post(
  "/",
  [
    authAdmin,
    [
      //TODO: better validation
      check("username", "username is required").notEmpty(),
      check("password", "password is required").notEmpty(),
      check("email", "email is required").notEmpty(),
      check("email", "invalid email address").isEmail(),
    ],
  ],
  async (req, res) => {
    try {
      // check for errors in request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // validate the admin id
      if (!mongoose.Types.ObjectId.isValid(req.admin.id)) {
        return res.status(400).json(INVALID_TOKEN);
      }

      // check if the logged admin is a superadmin
      const loggedAdmin = await Admin.findById(req.admin.id);
      if (!loggedAdmin) {
        return res.status(400).json(INVALID_TOKEN);
      }
      if (!loggedAdmin.permissions.super_admin) {
        return res.status(401).json(UNAUTHORIZED_ACCESS);
      }

      // create the new admin
      const { username, password, email, permissions } = req.body;
      // make sure username or email doesn't  exist already
      if (await Admin.findOne({ username })) {
        return res.status(400).json(USERNAME_ALREADY_IN_USE);
      } else if (await Admin.findOne({ email })) {
        return res.status(400).json(EMAIL_ALREADY_IN_USE);
      }
      // hash password
      const hashedPassword = await cryptPassword(password);
      // initiate new admin
      let newAdmin = new Admin({ username, password: hashedPassword, email });
      // add permissions if any
      if (permissions) {
        // CAREFUL: Having multiple super_admin can lead to problems keep only one
        if (permissions.super_admin) {
          newAdmin.permissions.super_admin = permissions.super_admin;
        }
        if (permissions.manage_users) {
          newAdmin.permissions.manage_users = permissions.manage_users;
        }
        if (permissions.manage_posts) {
          newAdmin.permissions.manage_posts = permissions.manage_posts;
        }
      }

      // save the new admin to the database and return his info without password field
      await newAdmin.save();
      newAdmin = newAdmin.toObject();
      delete newAdmin.password;
      return res.json(newAdmin);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

// @Endpoint:     PUT   /api/v1/admins/:id
// @Description   Update an admin information
// @Access        Private (superAdmin + Owner admin)
router.put("/:id", async (req, res) => {
  res.send("Admins");
});

// @Endpoint:     DELETE   /api/v1/admins/:id
// @Description   Delete an admin
// @Access        Private (superAdmin + Owner admin)
router.put("/:id", async (req, res) => {
  res.send("Admins");
});
module.exports = router;
