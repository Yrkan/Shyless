const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  profile_img_url: {
    type: String,
  },
  is_email_confirmed: {
    type: Boolean,
    default: false,
  },
  email_confirmation_token: {
    type: String,
  },
  ban_status: {
    is_banned: {
      type: Boolean,
      default: false,
    },
    banned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    ban_date: {
      type: Date,
    },
  },
  settings: {
    is_askable: {
      type: Boolean,
      default: true,
    },
    is_viewable: {
      type: Boolean,
      default: true,
    },
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
