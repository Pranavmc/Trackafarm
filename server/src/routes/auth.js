const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, farmName, phone, location, role, otp } = req.body;
    if (!otp) return res.status(400).json({ message: 'Verification OTP is required' });

    // Find the user (searching by both fields to be safe)
    let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone: phone }] });

    // Validate OTP (with Development Bypass)
    const isBypass = process.env.NODE_ENV === 'development' && otp === '123456';
    const isValidOtp = user && user.otp === otp && user.otpExpires > new Date();

    if (!isBypass && !isValidOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP verification code.' });
    }

    if (!user) return res.status(404).json({ message: 'No registration record found for this email/phone.' });

    // Update user details
    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone;
    user.password = password;
    user.farmName = farmName;
    user.location = location;
    user.role = role || 'farmer';
    user.status = 'pending';
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    res.status(201).json({
      message: 'Registration successful. Waiting for admin approval.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/otp/request
router.post('/otp/request', async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return res.status(400).json({ message: 'Email or Phone is required' });

    let user = await User.findOne(email ? { email } : { phone });
    
    if (!user) {
      user = new User({
        email: email || `user_${Date.now()}@temp.com`,
        phone,
        name: email ? email.split('@')[0] : 'New User',
        password: Math.random().toString(36).slice(-10),
        role: 'farmer',
        status: 'pending'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    // SEND OTP (Real Email if configured, else console)
    if (email) {
      await sendOtpEmail(email, otp);
    }
    console.log(`[AUTH-OTP] Target: ${email || phone} | Code: ${otp}`);
    res.json({ message: `OTP sent successfully to ${email || phone}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/otp/verify
router.post('/otp/verify', async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const user = await User.findOne(email ? { email } : { phone });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login (Traditional with Multi-Identifier)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: 'Identifier and password are required' });

    // Check if identifier is email or phone
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.status === 'pending' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ message: 'Your registration has been rejected. Please contact admin.' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        farmName: user.farmName,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
const { protect } = require('../middleware/auth');
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
