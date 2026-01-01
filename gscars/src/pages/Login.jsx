import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from '../url';

const Login = () => {
  const navigate = useNavigate();

  // --- LOGIN STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // --- FORGOT PASSWORD STATES ---
  const [view, setView] = useState("login"); // "login" or "forgot"
  const [resetStep, setResetStep] = useState(1); // 1 = Email, 2 = Verify
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState(''); // <--- CONFIRMATION STATE
  const [resetMsg, setResetMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. CHECK IF ALREADY LOGGED IN
  // If user is already saved, send them straight to Profile
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/profile");
    }
  }, [navigate]);

  // --- HANDLER: NORMAL LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      
      // Save User & Redirect
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/profile"); 
    } catch (err) {
      setError("❌ Invalid Email or Password");
    }
  };

  // --- HANDLER: SEND OTP (FORGOT PASS) ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetMsg("");
    
    try {
      // Calls the Brevo Email Route
      await axios.post(`${baseUrl}/api/auth/pass-reset-init`, { email: resetEmail });
      setResetStep(2);
      setResetMsg("✅ OTP Sent! Check your email.");
    } catch (err) {
      setResetMsg("❌ User not found or Error.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: VERIFY & RESET PASSWORD ---
  const handleResetPass = async (e) => {
    e.preventDefault();
    setResetMsg("");

    // 1. Check if passwords match
    if (newPass !== confirmPass) {
      setResetMsg("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // 2. Send to Backend
      await axios.post(`${baseUrl}/api/auth/pass-reset-verify`, {
        email: resetEmail,
        otp: resetOtp,
        newPassword: newPass
      });

      alert("✅ Password Reset Successfully! Please Login.");
      
      // 3. Reset View to Login
      setView("login");
      setResetStep(1);
      setNewPass("");
      setConfirmPass("");
      setResetOtp("");
    } catch (err) {
      setResetMsg("❌ Invalid OTP or Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md transition-all duration-500">
        
        {/* HEADER LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold italic text-white mb-2">
            <span className="text-blue-500">Gs</span>
            <span className="text-red-600">Cars</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            {view === "login" ? "Secure Login" : "Reset Password"}
          </p>
        </div>

        {/* --- VIEW 1: LOGIN FORM --- */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in-down">
            
            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-red-600 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Forgot Password Toggle */}
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => setView("forgot")} 
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-bold animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-105"
            >
              Login
            </button>
          </form>
        )}

        {/* --- VIEW 2: FORGOT PASSWORD FORM --- */}
        {view === "forgot" && (
          <div className="animate-fade-in-up">
            
            {resetStep === 1 ? (
              // STEP 1: ENTER EMAIL
              <form onSubmit={handleSendOtp} className="space-y-6">
                <p className="text-gray-300 text-sm text-center mb-4">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                {resetMsg && <div className="text-center font-bold text-red-400">{resetMsg}</div>}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            ) : (
              // STEP 2: VERIFY OTP & NEW PASSWORD
              <form onSubmit={handleResetPass} className="space-y-6">
                <p className="text-gray-300 text-sm text-center mb-4">
                  Code sent to <strong>{resetEmail}</strong>
                </p>
                
                {/* OTP Input */}
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">OTP Code</label>
                  <input 
                    type="text" 
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 text-center tracking-[0.5em] rounded border border-slate-600 focus:border-green-500 outline-none"
                    placeholder="0000"
                    maxLength="4"
                    required
                  />
                </div>
                
                {/* New Password */}
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">New Password</label>
                  <input 
                    type="password" 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-green-500 outline-none"
                    placeholder="New Password"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPass} 
                    onChange={(e) => setConfirmPass(e.target.value)} 
                    className={`w-full bg-slate-900 text-white p-3 rounded border outline-none ${
                      newPass && confirmPass && newPass !== confirmPass 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-600 focus:border-green-500'
                    }`}
                    placeholder="Re-enter Password" 
                    required 
                  />
                </div>

                {resetMsg && (
                  <div className={`text-center font-bold mb-2 ${resetMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {resetMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition shadow-lg"
                >
                  {loading ? "Resetting..." : "Set New Password"}
                </button>
              </form>
            )}

            {/* BACK BUTTON */}
            <button 
              onClick={() => { 
                setView("login"); 
                setResetStep(1); 
                setResetMsg(""); 
                setNewPass(""); 
                setConfirmPass(""); 
              }} 
              className="w-full text-center text-gray-500 text-sm mt-6 hover:text-white transition"
            >
              Cancel & Go Back
            </button>
          </div>
        )}

        {/* SIGN UP LINK (Only visible in Login view) */}
        {view === "login" && (
          <div className="mt-6 text-center text-gray-500 text-xs">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up here</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;