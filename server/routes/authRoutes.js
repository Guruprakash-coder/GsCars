const router = require('express').Router();
const User = require('../models/user');
const OTP = require('../models/otp');
const Brevo = require('@getbrevo/brevo'); // Import Brevo
const dotenv = require('dotenv');
dotenv.config();

// BREVO SETUP
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

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
    await OTP.deleteMany({ email });
    const newOtp = new OTP({ email, otp: otpCode });
    await newOtp.save();

    // Send Email via BREVO API
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Your GsCars Verification Code";
    sendSmtpEmail.htmlContent = `<html><body><h1>Welcome to GsCars!</h1><p>Your verification code is: <strong>${otpCode}</strong></p><p>This code expires in 5 minutes.</p></body></html>`;
    
    // IMPORTANT: Sender must be verified in Brevo
    sendSmtpEmail.sender = { "name": "GsCars Team", "email": process.env.BREVO_SENDER_EMAIL }; 
    sendSmtpEmail.to = [{ "email": email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json("OTP Sent Successfully");
  } catch (err) {
    console.error("Brevo Error:", err);
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
    const newUser = new User({ 
      username,
      email,
      password,
      mobile:mobile || ""
    });
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
// ... existing imports (User, OTP, nodemailer, etc.)

// ... (Your imports and Brevo setup exist above)

// 3. CHANGE PASSWORD - STEP 1: SEND OTP (CORRECTED FOR BREVO)
router.post('/pass-reset-init', async (req, res) => {
  try {
    const { email } = req.body;
    
    // User must exist
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    // Generate OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP
    await OTP.deleteMany({ email });
    const newOtp = new OTP({ email, otp: otpCode });
    await newOtp.save();

    // --- SEND EMAIL VIA BREVO API (HTTP) ---
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Reset Password Verification";
    sendSmtpEmail.htmlContent = `<html><body>
      <h1>Password Reset Request</h1>
      <p>Your verification code is: <strong>${otpCode}</strong></p>
      <p>If you did not request this, please ignore this email.</p>
    </body></html>`;
    
    // Sender & Recipient
    sendSmtpEmail.sender = { "name": "GsCars Security", "email": process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": email }];

    // Send
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json("OTP Sent");
  } catch (err) {
    console.error("Brevo Error:", err);
    res.status(500).json("Failed to send OTP");
  }
});

// 4. CHANGE PASSWORD - STEP 2: VERIFY & UPDATE (No changes needed here)
router.post('/pass-reset-verify', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) return res.status(400).json("Invalid OTP");

    // Update Password
    const user = await User.findOne({ email });
    user.password = newPassword; 
    await user.save();

    // Cleanup
    await OTP.deleteOne({ _id: validOtp._id });

    res.status(200).json("Password Updated Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});
// module.exports = router;
module.exports = router;