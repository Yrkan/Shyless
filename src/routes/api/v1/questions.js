const { Router } = require("express");
const router = Router();

// @Endpoint:     GET   /api/v1/questions/:id
// @Description   Get a single question by id
// @Access        Authorized (depend by creator/receiver and is_viewable)
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     GET   /api/v1/questions/me
// @Description   Get all connected user questions
// @Access        Own user
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     GET   /api/v1/questions/:username
// @Description   Get all viewable questions of a username
// @Access        Any user
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     GET   /api/v1/questions/all/:username
// @Description   Get all user's question (viewable and non viewable)
// @Access        Own user + Admins
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     POST   /api/v1/questions/
// @Description   create a question (ask someone)
// @Access        Any user
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     PUT   /api/v1/questions/:id
// @Description   Edit question / Reply
// @Access        Asker and Receiver (both limited)
router.get("/", async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     DELETE   /api/v1/questions/:id
// @Description   Delete a question
// @Access        Asker and Receiver and Admins
router.get("/", async (req, res) => {
  res.send("Questions");
});
module.exports = router;
