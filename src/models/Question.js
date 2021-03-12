const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    select: false,
  },
  is_anonym: {
    type: Boolean,
    required: true,
  },
  is_displayable: {
    type: Boolean,
    default: false,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Question = mongoose.model("Question", QuestionSchema);
