const User = require("../models/User");
const Diary = require("../models/Diary");

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Get all diaries
exports.getAllDiaries = async (req, res) => {
  const diaries = await Diary.find().populate("user", "name");
  res.json(diaries);
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Diary.deleteMany({ user: req.params.id }); // Optional cleanup
  res.json({ message: "User and their diaries deleted" });
};

// Delete diary
exports.deleteDiary = async (req, res) => {
  await Diary.findByIdAndDelete(req.params.id);
  res.json({ message: "Diary deleted" });
};

// Toggle public/private
exports.toggleDiaryVisibility = async (req, res) => {
  const diary = await Diary.findById(req.params.id);
  diary.isPublic = !diary.isPublic;
  await diary.save();
  res.json({ message: "Visibility updated", isPublic: diary.isPublic });
};