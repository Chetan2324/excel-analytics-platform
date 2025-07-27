const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({ message: "Email already exists." });

        const usernameExists = await User.findOne({ username: req.body.username });
        if (usernameExists) return res.status(400).json({ message: "Username already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered successfully!", userId: savedUser._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// LOGIN ROUTE with logging
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email); // Log the attempt

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('Login failed: Email not found.'); // Log this specific failure
            return res.status(400).json({ message: "Email not found." });
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            console.log('Login failed: Invalid password for user:', user.email); // Log this specific failure
            return res.status(400).json({ message: "Invalid password." });
        }
        
        console.log('Login successful for user:', user.email); // Log success

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
        console.error('Server error during login:', error); // Also improve the catch log
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;