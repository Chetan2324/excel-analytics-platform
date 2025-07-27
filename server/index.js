const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[SERVER] Starting up...');

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(express.json());


// --- Database Connection ---
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in your .env file.");
    process.exit(1);
}

mongoose.connect(uri);
const connection = mongoose.connection;

connection.on('connecting', () => {
  console.log('🟡 [DATABASE] Connecting to MongoDB...');
});

connection.on('connected', () => {
  console.log('✅ [DATABASE] Connected to MongoDB successfully!');
});

connection.on('error', (err) => {
  console.error('❌ [DATABASE] CONNECTION ERROR:', err);
  process.exit();
});

connection.on('disconnected', () => {
  console.log('🔴 [DATABASE] Disconnected from MongoDB.');
});


// --- API Routes ---
console.log("[SERVER] Loading API routes...");
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// --- THIS IS THE FIX ---
// The following two lines were missing. They enable the file upload route.
const fileRouter = require('./routes/file');
app.use('/api/file', fileRouter);
// ----------------------


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ [SERVER] Server is now running on port ${PORT}`);
});
