const Message = require("../models/Message");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// Send a message
exports.sendMessage = async (req, res) => {
  const sender = req.user._id;
  const { receiver, content } = req.body;

  if (!receiver || !content)
    return res.status(400).json({ error: "Receiver and content required" });

  try {
    const message = await Message.create({ sender, receiver, content });

    // Create a notification after message is saved
    await createNotification(
      receiver,
      sender,
      "message",
      "sent you a message",
      `/messages/${sender}`
    );

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Message send failed" });
  }
};


// Get conversation between two users
exports.getConversation = async (req, res) => {
  const userId = req.user._id;
  const { otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load conversation" });
  }
};

// List of all users user has talked to
exports.getChatList = async (req, res) => {
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const chatUserIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId.toString()) chatUserIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId.toString()) chatUserIds.add(msg.receiver.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(chatUserIds) } }).select("name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat list" });

  }
};
