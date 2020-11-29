const { Router } = require("express");
const router = Router();

// @Endpoint:     GET   /api/v1/auth/admin
// @Description   Get authentificated admin
// @Access        Private
router.get("/admin", async (req, res) => {
  res.send("Auth");
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
router.post("/admin/login", async (req, res) => {
  res.send("Auth");
});

// @Endpoint:     POST   /api/v1/auth/user/login
// @Description   Login user
// @Access        Public
router.post("/admin/login", async (req, res) => {
  res.send("Auth");
});
module.exports = router;
