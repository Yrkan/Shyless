const { Router } = require("express");
const mongoose = require("mongoose");

const router = Router();
const Admin = require("../../../models/Admin");
const { authAdmin } = require("../../../middlewears/auth");
const {
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
} = require("../../../consts/errors");

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
router.get("/:id", async (req, res) => {
  res.send("Admins");
});

// @Endpoint:     POST   /api/v1/admins/
// @Description   Create a new admin
// @Access        Private (superAdmin only)
router.post("/", async (req, res) => {
  res.send("Admins");
});

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
