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
      check("username", "Invalid username")
        .notEmpty()
        .isString()
        .isAlphanumeric(),
      check("password", "Invalid password")
        .notEmpty()
        .isString()
        .isAlphanumeric(),
      check("email", "Invalid email").notEmpty().isString().isEmail(),
    ],
  ],
  async (req, res) => {
    try {
      // check for errors in request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array({ onlyFirstError: true }) });
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
router.put(
  "/:id",
  [
    authAdmin,
    [
      //TODO: better validation
      check("username", "Invalid username")
        .notEmpty()
        .isString()
        .isAlphanumeric()
        .optional(),
      check("password", "Invalid password").notEmpty().isString().optional(),
      check("email", "Invalid email")
        .notEmpty()
        .isString()
        .isEmail()
        .optional(),
    ],
  ],
  async (req, res) => {
    try {
      // check for errors in request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array({ onlyFirstError: true }) });
      }

      // validate the id
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json(INVALID_TOKEN);
      }

      // check if the requested admin exists
      if (!(await Admin.findById(req.params.id))) {
        return res.status(400).json(INVALID_ID);
      }
      // check if the logged admin is a superadmin or the ownerAdmin
      const loggedAdmin = await Admin.findById(req.admin.id);
      if (!loggedAdmin) {
        return res.status(400).json(INVALID_TOKEN);
      }
      if (
        !(
          loggedAdmin.permissions.super_admin ||
          loggedAdmin.id === req.params.id
        )
      ) {
        return res.status(401).json(UNAUTHORIZED_ACCESS);
      }

      // update the admin
      const { username, password, email, permissions } = req.body;
      const updates = {};
      if (username) {
        // make sure  username doesn't  exist already
        if (await Admin.findOne({ username })) {
          return res.status(400).json(USERNAME_ALREADY_IN_USE);
        }
        updates.username = username;
      }

      if (email) {
        // make sure  email doesn't  exist already
        if (await Admin.findOne({ email })) {
          return res.status(400).json(EMAIL_ALREADY_IN_USE);
        }
        updates.email = email;
      }

      if (password) {
        const hashedPassword = await cryptPassword(password);
        updates.password = hashedPassword;
      }

      // add permissions if any
      if (permissions) {
        // Only super admins can update permissions
        if (!loggedAdmin.permissions.super_admin) {
          return res.status(401).json(UNAUTHORIZED_ACCESS);
        }
        const newPermissions = {};
        // CAREFUL: Having multiple super_admin can lead to problems keep only one
        if (permissions.super_admin) {
          newPermissions.super_admin = permissions.super_admin;
        }
        if (permissions.manage_users) {
          newPermissions.manage_users = permissions.manage_users;
        }
        if (permissions.manage_posts) {
          newPermissions.manage_posts = permissions.manage_posts;
        }
        updates.permissions = newPermissions;
      }

      // Update the admin info and return the new info
      const newAdminInfo = await Admin.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );

      return res.json(newAdminInfo);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

// @Endpoint:     DELETE   /api/v1/admins/:id
// @Description   Delete an admin
// @Access        Private (superAdmin + Owner admin)
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    // validate the id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
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

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(400).json(INVALID_TOKEN);
    }

    // Delete the admin
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    return res.json(deletedAdmin);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
});
module.exports = router;
