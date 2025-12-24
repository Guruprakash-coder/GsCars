import React, { useState } from 'react';
import axios from 'axios'; // IMPORTED
import { useNavigate, Link } from 'react-router-dom';
import { baseUrl } from '../url'; // IMPORTED

const Login = () => {
  const [email, setEmail] = useState(''); // Added Email State
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      
      // Save user object
      localStorage.setItem("user", JSON.stringify(res.data));
      
      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("❌ Invalid Email or Password");
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
          <p className="text-gray-400 text-sm tracking-widest uppercase">Secure Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* ADDED EMAIL INPUT */}
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-xs">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up here</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;