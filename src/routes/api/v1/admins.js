const { Router } = require("express");
const router = Router();

// @Endpoint:     GET   /api/v1/admins/
// @Description   Get a List of admins
// @Access        Private (superAdmin only)
router.get("/", async (req, res) => {
  res.send("Admins");
});

// @Endpoint:     GET   /api/v1/admins/:id
// @Description   Get a single admin information
// @Access        Private (superAdmin + Owner admin)
router.get("/:id", async (req, res) => {
  res.send("Admins");
});

// @Endpoint:     POST   /api/v1/admins/
// @Description   Create a nw admin
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
