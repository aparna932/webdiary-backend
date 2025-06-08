const express = require("express");
const router = express.Router();
const diaryController = require("../controllers/diaryController");
const protect = require("../middleware/authMiddleware");
const { likePost, unlikePost } = require("../controllers/diaryController");
const { addComment, getComments } = require("../controllers/diaryController");
const { togglePrivacy } = require("../controllers/diaryController");
const { getPublicFeed } = require("../controllers/diaryController");

router.post("/", diaryController.createEntry);
router.get("/public", diaryController.getPublicEntries);
router.get("/my", diaryController.getMyEntries);

router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);

router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);

router.patch("/:id/toggle-privacy", protect, togglePrivacy);

router.get("/feed/public", getPublicFeed);

module.exports = router;