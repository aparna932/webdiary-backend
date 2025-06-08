const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createNotification } = require("./notificationController");

const register = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name: fullName, email, password: hash });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUser = req.user;

    if (targetId === currentUser.id) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.followers.includes(currentUser._id)) {
      return res.status(400).json({ error: "Already following" });
    }

    targetUser.followers.push(currentUser._id);
    await targetUser.save();

    currentUser.following.push(targetUser._id);
    await currentUser.save();

    await createNotification(
      targetUser._id,
      req.user._id,
      "follow",
      "started following you",
      `/profile/${req.user._id}`
    );

    res.json({ message: `You followed ${targetUser.name}` });
  } catch (err) {
    res.status(500).json({ error: "Follow failed" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUser = req.user;

    const targetUser = await User.findById(targetId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (followerId) => followerId.toString() !== currentUser._id.toString()
    );
    await targetUser.save();

    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== targetUser._id.toString()
    );
    await currentUser.save();

    res.json({ message: `You unfollowed ${targetUser.name}` });
  } catch (err) {
    res.status(500).json({ error: "Unfollow failed" });
  }
};

const addBookmark = async (req, res) => {
  const userId = req.user._id;
  const { id: diaryId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user.bookmarks.includes(diaryId))
      return res.status(400).json({ error: "Already bookmarked" });

    user.bookmarks.push(diaryId);
    await user.save();

    res.json({ message: "Bookmarked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Bookmark failed" });
  }
};

const removeBookmark = async (req, res) => {
  const userId = req.user._id;
  const { id: diaryId } = req.params;

  try {
    const user = await User.findById(userId);
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== diaryId
    );
    await user.save();

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: "Unbookmark failed" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      match: { isPublic: true },
      populate: { path: "user", select: "name" },
    });

    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch bookmarks" });
  }
};

module.exports = {
  register,
  login,
  followUser,
  unfollowUser,
  addBookmark,
  removeBookmark,
  getBookmarks,
};
