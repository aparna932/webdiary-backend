const Notification = require("../models/Notification");

exports.createNotification = async (userId, fromId, type, message, link) => {
  try {
    await Notification.create({ user: userId, from: fromId, type, message, link });
  } catch (err) {
    console.error("Notification failed:", err.message);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("from", "name");

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to load notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};