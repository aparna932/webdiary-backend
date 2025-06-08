// routes/messageRoutes.js
const express = require('express');
const router = express.Router();

// GET /api/messages
router.get('/', (req, res) => {
    res.json({ message: 'Messages route is working!' });
});

module.exports = router;
