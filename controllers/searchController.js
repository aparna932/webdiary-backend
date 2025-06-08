const Diary = require("../models/Diary");

exports.searchDiaries = async (req, res) => {
  try {
    const { q, tags, author, from, to, page = 1, limit = 10 } = req.query;

    const filters = { isPublic: true }; // Only public diaries by default

    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    if (tags) {
      const tagList = tags.split(",");
      filters.tags = { $in: tagList };
    }

    if (author) {
      filters.user = author;
    }

    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const diaries = await Diary.find(filters)
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const count = await Diary.countDocuments(filters);

    res.json({
      data: diaries,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};