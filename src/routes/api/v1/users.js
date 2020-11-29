const { Router } = require("express");
const router = Router();

// @Endpoint:     GET   /api/v1/users/
// @Description   Get a list of users
// @Access        Private (superAdmin + manage_uses Admins)
router.get("/", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     GET   /api/v1/users/:id
// @Description   Get a single user full informations
// @Access        Private (superAdmin + manage_uses Admins + Own user)
router.get("/:id", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     GET   /api/v1/users/profile/:username
// @Description   Get a single user profile
// @Access        Public
router.get("/profile/:username", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     POST   /api/v1/users/
// @Description   Create a new user (From admin panel)
// @Access        Private (superAdmin + manage_uses Admins)
router.post("/", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     POST   /api/v1/users/register
// @Description   Register a new user
// @Access        Public
router.post("/register", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     PUT   /api/v1/users/:id
// @Description   Update a user informations
// @Access        Private (superAdmin + manage_uses Admins + Own user)
router.put("/:id", async (req, res) => {
  res.send("Users");
});

// @Endpoint:     DELETE   /api/v1/users/:id
// @Description   Delete a user
// @Access        Private (superAdmin + manage_uses Admins + Own user)
router.put("/;id", async (req, res) => {
  res.send("Users");
});
module.exports = router;
