import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // --- THE SECRET PASSWORD ---
    // For now, we will hardcode it here. 
    // In a huge app, we would check this on the server.
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      
      // Save entire user object (contains isAdmin flag)
      localStorage.setItem("user", JSON.stringify(res.data));
      
      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Login Failed");
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
          <p className="text-gray-400 text-sm tracking-widest uppercase">Admin Security</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Enter Admin Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600 focus:border-red-600 outline-none text-center tracking-widest"
              placeholder="••••••••"
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
            Unlock Dashboard
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;