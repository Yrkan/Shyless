const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const {
  INTERNAL_SERVER_ERROR,
  USERNAME_ALREADY_IN_USE,
  EMAIL_ALREADY_IN_USE,
  EMAIL_ALREADY_CONFIRMED,
  INVALID_ID,
  INVALID_TOKEN,
} = require("../../../consts/errors");
const {
  USER_REGISTRED_SUCCESSFULLY,
  EMAIL_CONFIRMED_SUCCESSFULLY,
} = require("../../../consts/messages");
const router = Router();

const User = require("../../../models/User");
const { cryptPassword } = require("../../../utils/crypto");
const { generateEmailVerificationToken } = require("../../../utils/email");

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
router.post(
  "/register",
  [
    check("username", "username is required").notEmpty(),
    check("password", "password is required").notEmpty(),
    check("email", "email is required").notEmpty(),
    check("email", "invaldie email").isEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { username, password, email } = req.body;

      // Verify that username and email aren't already in use
      if (await User.findOne({ username })) {
        return res.status(400).json(USERNAME_ALREADY_IN_USE);
      } else if (await User.findOne({ email })) {
        return res.status(400).json(EMAIL_ALREADY_IN_USE);
      }

      // hash password
      hashedpassword = await cryptPassword(password);
      // Initiate the new user
      const user = new User({
        username,
        password: hashedpassword,
        email,
      });
      // set confirmation token
      user.email_confirmation_token = generateEmailVerificationToken(user.id);
      // save user
      await user.save();

      return res.json(USER_REGISTRED_SUCCESSFULLY);
    } catch (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

// @Endpoint:     POST   /api/v1/users/register
// @Description   Validate a user
// @Access        Public
router.post(
  "/verify/:id",
  [check("token", "token is required").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      // validate the user id
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json(INVALID_ID);
      }

      const { token } = req.body;

      const user = await User.findById(req.params.id).select(
        "+email_confirmation_token"
      );

      // user id doesn't exist
      if (!user) {
        return res.status(400).json(INVALID_ID);
      }

      // user email already verified
      if (user.is_email_confirmed) {
        return res.status(400).json(EMAIL_ALREADY_CONFIRMED);
      }

      // user exists but bad token
      if (user.email_confirmation_token != token) {
        return res.status(401).json(INVALID_TOKEN);
      }

      // user exists and good token => verify user
      user.is_email_confirmed = true; // set confirmed
      user.email_confirmation_token = ""; // clear email confirmation

      await user.save();
      return res.json(EMAIL_CONFIRMED_SUCCESSFULLY);
    } catch (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
  }
);

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
