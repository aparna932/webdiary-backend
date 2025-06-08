const { register, login, followUser, unfollowUser, addBookmark, removeBookmark, getBookmarks } = require("../controllers/userController");
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

router.post("/bookmark/:id", protect, addBookmark);
router.delete("/bookmark/:id", protect, removeBookmark);
router.get("/bookmarks", protect, getBookmarks);

module.exports = router;
