const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String, required: true },
    tags:[String],
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diary", diarySchema);