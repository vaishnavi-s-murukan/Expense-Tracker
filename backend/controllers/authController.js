const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register function
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Register request:", username, email); // ✅ log inputs

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User saved!");

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Register Error:", error); // ✅ real error shown here
    res.status(500).json({ message: 'Error registering user' });
  }
};
// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request:", email); // Log the incoming email

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token if credentials are valid
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Login successful, token generated!");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error); // Log the actual error
    res.status(500).json({ message: 'Error logging in' });
  }
};
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Use req.user.id, not req.userId
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user); // Return user data
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

