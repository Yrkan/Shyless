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
    super_admin: {
      type: Boolean,
      default: false,
    },
    manage_users: {
      type: Boolean,
      default: false,
    },
    manage_posts: {
      type: Boolean,
      default: false,
    },
  },
  update_date: {
    type: Date,
    default: Date.now,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Admin = mongoose.model("Admin", AdminSchema);
