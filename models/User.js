const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Diary" }],
  notifications: [{ type: String }]
});

module.exports = mongoose.model("User", userSchema);