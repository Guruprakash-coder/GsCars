import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from '../url';

const Signup = () => {
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${baseUrl}/api/auth/signup-init`, { email });
      setStep(2); // Move to next screen
      alert("✅ OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP. Email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP & CREATE ACCOUNT
  const handleVerifySignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${baseUrl}/api/auth/signup-verify`, {
        username, email, password, otp
      });
      alert("✅ Account Verified & Created!");
      navigate("/login");
    } catch (err) {
      setError("❌ Invalid or Expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold italic text-white mb-2">
            <span className="text-blue-500">Gs</span><span className="text-red-600">Cars</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            {step === 1 ? "Create Account" : "Verify Email"}
          </p>
        </div>

        {step === 1 ? (
          // --- FORM 1: DETAILS ---
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none" placeholder="Driver123" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none" placeholder="you@gmail.com" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-red-600 outline-none" placeholder="••••••••" required />
            </div>
            {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
            
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-3 rounded-lg font-bold shadow-lg transition">
              {loading ? "Sending OTP..." : "Next: Verify Email"}
            </button>
          </form>

        ) : (
          // --- FORM 2: OTP ---
          <form onSubmit={handleVerifySignup} className="space-y-5 animate-fade-in-down">
            <div className="text-center text-gray-300 text-sm mb-4">
              We sent a 4-digit code to <span className="text-white font-bold">{email}</span>.
            </div>
            <div>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-slate-900 text-white p-4 text-center text-2xl tracking-[0.5em] rounded border border-blue-500 focus:border-green-500 outline-none" placeholder="0000" maxLength="4" required />
            </div>
            {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
            
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-lg transition">
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 text-sm hover:text-white mt-2">Go Back</button>
          </form>
        )}

        <div className="mt-6 text-center text-gray-500 text-xs">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;