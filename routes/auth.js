const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import the authMiddleware
const authmiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require('../middleware/roleMiddleware');


// Register Route
router.post('/register', async (req, res) => {
    const { username, password, email , role} = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const userRole = role && (role === 'admin' || role === 'user') ? role : 'user';
        // Create a new user (password will be hashed automatically by the pre-save hook)
        const user = new User({ username, password, email , role: userRole });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully!'
        });

    } catch (err) {
        console.error(err.message);  // Optional: You can log the error for debugging
        res.status(400).json({
            error: 'User registration failed!'
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Log the stored password hash and input password
        console.log('Stored Password Hash:', user.password);
        console.log('Input Password:', password);

        
        const isMatch = await bcrypt.compare(password , user.password);
        console.log('Password Match:', isMatch); // Log the result of password comparison

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        
        const token = jwt.sign({ id: user._id  , role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error!" });
    }
});



// Define the protected route with authMiddleware
router.get('/protected', authmiddleware, (req, res) => {
     return res.json({ message: "This is a protected route!" });
});

router.get('/user-dashboard' , authmiddleware, roleMiddleware(['user' , 'admin']) , (req,res) => {
    res.json({message: "Welcome to the user dashboard!"})
});

router.get('/admin-dashboard', authmiddleware , roleMiddleware(['admin']) , (req,res) => {
    res.json({message: "Welcome to the admin dashboard!"})
})
module.exports = router;
