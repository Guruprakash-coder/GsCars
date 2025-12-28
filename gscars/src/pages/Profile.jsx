import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../url';

const Profile = () => {
  const navigate = useNavigate();
  // Load user from storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [interests, setInterests] = useState(user?.interests || []);
  const [msg, setMsg] = useState("");

  const categories = ["Interior", "Exterior", "Lighting", "Car Care", "Electronics", "Performance"];

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  const toggleInterest = (category) => {
    if (interests.includes(category)) {
      setInterests(interests.filter(c => c !== category));
    } else {
      setInterests([...interests, category]);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/users/update/${user._id}`, { interests });
      // Update local storage with new data
      localStorage.setItem("user", JSON.stringify(res.data));
      setMsg("✅ Preferences Saved Successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to save.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Your Interests</h2>
          <p className="text-gray-500 mb-6 text-sm">Select the categories you are interested in so we can recommend better products.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => toggleInterest(cat)}
                className={`p-3 rounded-lg border font-medium transition-all ${
                  interests.includes(cat) 
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                }`}
              >
                {interests.includes(cat) ? "✓ " : "+ "}{cat}
              </button>
            ))}
          </div>

          {msg && <div className="text-center text-green-600 font-bold mb-4">{msg}</div>}

          <button 
            onClick={handleSave} 
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mb-4"
          >
            Save Preferences
          </button>

          <div className="border-t pt-6 mt-6 flex justify-between items-center">
             {user.isAdmin && (
               <button onClick={() => navigate("/admin")} className="text-blue-600 font-bold hover:underline">
                 Go to Admin Panel
               </button>
             )}
             
             <button onClick={handleLogout} className="text-red-500 font-bold hover:text-red-700 ml-auto">
               Logout
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;