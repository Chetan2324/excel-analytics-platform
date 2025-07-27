const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
});
mongoose.connection.on('error', (err) => {
  console.error("MongoDB connection error:", err);
  process.exit();
});

// API Routes
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file'); // NEW: Import the file routes

app.use('/api/auth', authRouter);
app.use('/api/file', fileRouter);         // NEW: Use the file routes

app.get('/', (req, res) => {
  res.send('Hello from the Excel Analytics Platform server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});