import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../url';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [history, setHistory] = useState([]);

  // 1. CHECK LOGIN & FETCH HISTORY
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      // Use the endpoint we created in userRoutes.js
      const res = await axios.get(`${baseUrl}/api/users/history/${user._id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- SECTION 1: USER INFO CARD --- */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8 flex flex-col md:flex-row items-center p-8">
          
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 md:mb-0 md:mr-8 shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-slate-800">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
            {user.isAdmin && (
               <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">
                 ADMIN
               </span>
            )}
          </div>

          <div className="mt-6 md:mt-0 flex flex-col gap-3 w-full md:w-auto">
            {user.isAdmin && (
               <button onClick={() => navigate("/admin")} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-700 transition shadow">
                 Admin Dashboard
               </button>
            )}
            <button onClick={handleLogout} className="px-6 py-2 border border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 transition">
               Logout
            </button>
          </div>

        </div>

        {/* --- SECTION 2: RECENTLY VIEWED (Replaces Interests) --- */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
            Recently Viewed
          </h2>

          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>You haven't viewed any products yet.</p>
              <Link to="/products" className="text-blue-500 font-bold hover:underline mt-2 inline-block">
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group block">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-40 mb-3 relative">
                     <img 
                       src={product.images[0]} 
                       alt={product.name} 
                       className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                     />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
                  <p className="text-red-600 font-bold text-sm">₹{product.price}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;