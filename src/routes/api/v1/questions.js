const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const {
  INTERNAL_SERVER_ERROR,
  INVALID_ID,
  UNAUTHORIZED_ACCESS,
  NOT_FOUND,
} = require("../../../consts/errors");
const { MESSAGE_SENT_SUCCESSFULLY } = require("../../../consts/messages");
const User = require("../../../models/User");
const Question = require("../../../models/Question");
const { authAdmin, passGuests } = require("../../../middlewears/auth");

const router = Router();

// @Endpoint:     GET   /api/v1/questions/:id
// @Description   Get a single question by id
// @Access        Authorized (depends on creator/receiver and is_viewable)
router.get("/:id", passGuests, async (req, res) => {
  try {
    // Check the question id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json(INVALID_ID);
    }

    // Check the question
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(400).json(INVALID_ID);
    }

    // Non displayable questions are only viewable to the asked user
    if (!question.is_displayable) {
      if (!req.user || req.user.id != question.to_user) {
        return res.status(401).json(UNAUTHORIZED_ACCESS);
      }
    }

    // If question is anonym we don't want to show the user
    const c_question = question.toObject();
    if (question.is_anonym) {
      delete c_question.by_user;
    }

    return res.json(c_question);
  } catch (err) {
    console.error(err);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
});

// @Endpoint:     GET   /api/v1/questions/user/:username
// @Description   Get all viewable questions of a username
// @Access        Any user
router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(400).json(NOT_FOUND);
    }

    const questions = await Question.find({
      to_user: user._id,
      is_displayable: true,
    });

    return res.json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
});

// @Endpoint:     GET   /api/v1/questions/all/:username
// @Description   Get all user's question (viewable and non viewable)
// @Access        Own user + Admins
router.get("/", authAdmin, async (req, res) => {
  res.send("Questions");
});

// @Endpoint:     POST   /api/v1/questions/
// @Description   create a question (ask someone)
// @Access        Public
router.post(
  "/",
  passGuests,
  [
    check("text", "question can't be empty").notEmpty(),
    check("to_user", "reveiver ID is required").notEmpty(),
    check("is_anonym", "is_anonyme is a boolean").isBoolean().notEmpty(),
  ],
  async (req, res) => {
    try {
      // check for errors in request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text, to_user, is_anonym } = req.body;

      // validate the reveiver user exists
      if (!mongoose.Types.ObjectId.isValid(to_user)) {
        return res.status(400).json(INVALID_ID);
      }

      const receiver = await User.findById(to_user);
      // no user found
      if (!receiver) {
        return res.status(400).json(INVALID_ID);
      }

      // check if receiver is askable (privacy settings allow it + not banned + email activated)
      if (
        !receiver.settings.is_askable ||
        !receiver.settings.is_viewable ||
        !receiver.is_email_confirmed ||
        receiver.ban_status.is_banned
      ) {
        return res.status(401).json(UNAUTHORIZED_ACCESS);
      }
      // init question
      const question = new Question({
        text,
        to_user,
        is_anonym,
      });

      if (req.user) {
        // user can't ask himself
        if (req.user.id == to_user) {
          return res.status(401).json(UNAUTHORIZED_ACCESS);
        }
        question.by_user = req.user.id;
      } else {
        // if question  sent by a visitor it MUST be anonym
        question.is_anonym = true;
      }

      // save the new question
      await question.save();

      return res.json(MESSAGE_SENT_SUCCESSFULLY);
    } catch (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

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
