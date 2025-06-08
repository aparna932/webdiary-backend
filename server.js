// server.js
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');

dotenv.config();      // Load environment variables
connectDB();          // Connect to MongoDB

const app = express();

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins
}));


app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // for form data
app.use('/api/search', searchRoutes);


// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount API routes
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes); // Assuming userRoutes exists


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Error handling (optional)
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
