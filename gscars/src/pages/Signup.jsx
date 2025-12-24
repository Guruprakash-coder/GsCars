import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from '../url';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Send data to the backend Register route
      await axios.post(`${baseUrl}/api/auth/register`, {
        username,
        email,
        password
      });

      // If successful, redirect to Login
      alert("✅ Account Created! Please Login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("❌ Signup Failed. Try a different email or username.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold italic text-white mb-2">
            <span className="text-blue-500">Gs</span>
            <span className="text-red-600">Cars</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Create Account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          
          {/* USERNAME INPUT */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none"
              placeholder="Driver123"
              required
            />
          </div>

          {/* EMAIL INPUT */}
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

          {/* PASSWORD INPUT */}
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

          {error && (
            <div className="text-red-500 text-sm text-center font-bold animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-xs">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;