import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from '../url';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState(''); // <--- NEW STATE
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupInit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/auth/signup-init`, { email });
      setStep(2); // Move to OTP step
    } catch (err) {
      setError("❌ Signup Failed. Email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Send mobile along with other details
      await axios.post(`${baseUrl}/api/auth/signup-verify`, { 
        username, 
        email, 
        password, 
        otp,
        mobile 
      });
      navigate("/login");
    } catch (err) {
      setError("❌ Invalid OTP or Error.");
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
          <p className="text-gray-400 text-sm tracking-widest uppercase">Create Account</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSignupInit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none" required />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none" required />
            </div>

            {/* NEW MOBILE INPUT */}
            <div>
              <label className="text-gray-400 text-sm block">Mobile Number <span className="text-xs text-gray-500">(Optional)</span></label>
              <input 
                type="text" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none" 
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 outline-none" required />
            </div>

            {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition">
              {loading ? "Processing..." : "Next"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupVerify} className="space-y-6">
            <p className="text-gray-300 text-center">Enter OTP sent to {email}</p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-slate-900 text-white p-3 text-center tracking-[0.5em] rounded border border-slate-600 outline-none" placeholder="0000" maxLength="4" required />
            
            {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
            
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition">
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>
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