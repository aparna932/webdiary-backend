// server.js
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5000;

dotenv.config();      // Load environment variables
connectDB();          // Connect to MongoDB

const app = express();

app.use(cors({
    origin: 'http://localhost:5000', 
    credentials: true
}));


app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use Message Routes
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Keep the process alive
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

