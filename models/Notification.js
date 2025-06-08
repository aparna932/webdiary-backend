const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who triggered it
    type: { type: String, enum: ["like", "comment", "follow", "message"], required: true },
    message: { type: String },
    link: { type: String }, // frontend route like /diary/123
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);