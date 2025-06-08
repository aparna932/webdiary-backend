const express = require("express");
const router = express.Router();
const { searchDiaries } = require("../controllers/searchController");

router.get("/", searchDiaries);

module.exports = router;