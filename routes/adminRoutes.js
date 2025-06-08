const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  getAllDiaries,
  deleteUser,
  deleteDiary,
  toggleDiaryVisibility,
} = require("../controllers/adminController");

router.use(protect, isAdmin);

router.get("/users", getAllUsers);
router.get("/diaries", getAllDiaries);
router.delete("/user/:id", deleteUser);
router.delete("/diary/:id", deleteDiary);
router.patch("/diary/:id/toggle-visibility", toggleDiaryVisibility);