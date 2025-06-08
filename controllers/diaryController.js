const Diary = require("../models/Diary");//pubpri
const { createNotification } = require("./notificationController");

exports.createEntry = async (req, res) => {
  const { title, content, isPublic, userId } = req.body;
  try {
    const entry = await Diary.create({ title, content, isPublic, user: userId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Error creating entry" });
  }
};

exports.getPublicEntries = async (req, res) => {
  const entries = await Diary.find({ isPublic: true }).populate("user", "name");
  res.json(entries);
};

exports.getMyEntries = async (req, res) => {
  const userId = req.body.userId;
  const entries = await Diary.find({ user: userId });
  res.json(entries);
};

const Diary = require("../models/Diary");

exports.likePost = async (req, res) => {
  const diaryId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Diary.findById(diaryId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "Already liked" });
    }

    post.likes.push(userId);
    await post.save();

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
};

exports.unlikePost = async (req, res) => {
  const diaryId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Diary.findById(diaryId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.likes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    await post.save();

    res.json({ message: "Like removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove like" });
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const post = await Diary.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Diary.findById(id).populate("comments.user", "name");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comments" });
  }
};

exports.togglePrivacy = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Diary.findById(id);

    if (!post) return res.status(404).json({ error: "Diary not found" });
    if (post.user.toString() !== userId.toString())
      return res.status(403).json({ error: "Not authorized" });

    post.isPublic = !post.isPublic;
    await post.save();

    res.json({
      message: Diary is now ${post.isPublic ? "Public" : "Private"},
      isPublic: post.isPublic,
    });
  } catch (err) {
    res.status(500).json({ error: "Privacy update failed" });
  }
};

exports.getPublicFeed = async (req, res) => {
  try {
    const publicPosts = await Diary.find({ isPublic: true })
      .populate("user", "name") // show author's name
      .sort({ createdAt: -1 }); // newest first

    res.json(publicPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public feed" });
  }
};
// When someone likes your diary
await createNotification(diary.user, req.user._id, "like", "liked your diary", /diary/${diary._id});

// When someone comments
await createNotification(diary.user, req.user._id, "comment", "commented on your diary", /diary/${diary._id});