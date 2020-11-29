const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
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
    required: true,
  },
  permissions: {
    // Highest role can manage other admins (preferably keep only 1 superAdmin)
    superAdmin: {
      type: Boolean,
      default: false,
    },
    manageUsers: {
      type: Boolean,
      default: false,
    },
    managePosts: {
      type: Boolean,
      default: false,
    },
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Admin = mongoose.model("Admin", AdminSchema);
