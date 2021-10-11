const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("user", userSchema, "users");

module.exports = userModel;
