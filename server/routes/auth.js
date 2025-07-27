const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('✅ [AUTH ROUTER] File loaded.');

// --- REGISTRATION ROUTE ---
router.post('/register', async (req, res) => {
    console.log('[REGISTER] Attempting to register user:', req.body.email);
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            console.log('[REGISTER] Failed: Email already exists.');
            return res.status(400).json({ message: "Email already exists." });
        }

        const usernameExists = await User.findOne({ username: req.body.username });
        if (usernameExists) {
            console.log('[REGISTER] Failed: Username already exists.');
            return res.status(400).json({ message: "Username already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log('[REGISTER] Success: User registered successfully.');
        res.status(201).json({ message: "User registered successfully!", userId: savedUser._id });
    } catch (error) {
        console.error('❌ [REGISTER] Server error:', error);
        res.status(500).json({ message: "Server error during registration.", error });
    }
});
console.log('✅ [AUTH ROUTER] /register route defined.');


// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    console.log('[LOGIN] Attempting login for email:', req.body.email);
    try {
        if (!process.env.JWT_SECRET) {
            console.error("FATAL ERROR: JWT_SECRET is not defined in your .env file.");
            // Don't expose this internal error detail to the user.
            return res.status(500).json({ message: "An internal server configuration error occurred." });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('[LOGIN] Failed: Email not found.');
            return res.status(400).json({ message: "Email not found." });
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            console.log('[LOGIN] Failed: Invalid password for user:', user.email);
            return res.status(400).json({ message: "Invalid password." });
        }
        
        console.log('✅ [LOGIN] Success: Login successful for user:', user.email);

        const token = jwt.sign(
            { _id: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.header('auth-token', token).json({ 
            message: "Logged in successfully!",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            }
         });

    } catch (error) {
        console.error('❌ [LOGIN] Server error:', error);
        res.status(500).json({ message: "Server error during login.", error });
    }
});
console.log('✅ [AUTH ROUTER] /login route defined.');


module.exports = router;
