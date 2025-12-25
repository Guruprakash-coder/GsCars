const router = require('express').Router();
const User = require('../models/user');
const OTP = require('../models/otp'); // New Model
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your new Gmail ID
    pass: process.env.EMAIL_PASS, // Your Gmail App Password (NOT login password)
  }
});

// 1. INITIATE SIGNUP (Send OTP)
router.post('/signup-init', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("Email already registered!");

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP to DB
    // First, delete any old OTPs for this email
    await OTP.deleteMany({ email });
    const newOtp = new OTP({ email, otp: otpCode });
    await newOtp.save();

    // Send Email
    await transporter.sendMail({
      from: '"GsCars Security" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Your GsCars Verification Code',
      text: `Your verification code is: ${otpCode}. It expires in 5 minutes.`
    });

    res.status(200).json("OTP Sent Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to send email");
  }
});

// 2. COMPLETE SIGNUP (Verify OTP & Create User)
router.post('/signup-verify', async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // Check OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) return res.status(400).json("Invalid or Expired OTP");

    // Create User
    const newUser = new User({ username, email, password });
    const user = await newUser.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: validOtp._id });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN (Keep as is)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");
    if (user.password !== req.body.password) return res.status(400).json("Wrong Credentials!");
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;