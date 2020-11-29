const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  is_modified: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Comment = mongoose.model("Comment", CommentSchema);
