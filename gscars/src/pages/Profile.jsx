import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../url';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [history, setHistory] = useState([]);
  
  // PASSWORD STATES
  const [showPassForm, setShowPassForm] = useState(false);
  const [passStep, setPassStep] = useState(1); 
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW: MOBILE UPDATE STATE
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [newMobile, setNewMobile] = useState('');

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/users/history/${user._id}`);
      setHistory(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- ADD MOBILE NUMBER ---
  const handleAddMobile = async () => {
    if (!newMobile) return;
    try {
      // Use the Update Route
      const res = await axios.put(`${baseUrl}/api/users/update/${user._id}`, { mobile: newMobile });
      
      // Update Local Storage & State
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setShowMobileInput(false);
      alert("Mobile Number Added!");
    } catch (err) {
      alert("Failed to update mobile number.");
    }
  };

  // ... (Keep Password Functions: sendOtp, updatePassword exactly as before) ...
  const sendOtp = async () => {
    setLoading(true); setPassMsg("");
    try { await axios.post(`${baseUrl}/api/auth/pass-reset-init`, { email: user.email }); setPassStep(2); setPassMsg("✅ OTP Sent!"); } 
    catch (err) { setPassMsg("❌ Failed to send OTP."); } finally { setLoading(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault(); setPassMsg("");
    if (newPassword !== confirmPass) { setPassMsg("❌ Passwords do not match!"); return; }
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/auth/pass-reset-verify`, { email: user.email, otp, newPassword });
      alert("Password Changed! Please login again."); handleLogout();
    } catch (err) { setPassMsg("❌ Invalid OTP."); } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- USER INFO CARD --- */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8 flex flex-col md:flex-row items-center p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 md:mb-0 md:mr-8 shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-slate-800">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
            
            {/* MOBILE NUMBER SECTION */}
            <div className="mt-2 text-sm">
              {user.mobile ? (
                <span className="text-slate-600 font-medium">📞 {user.mobile}</span>
              ) : (
                <>
                  {!showMobileInput ? (
                    <button 
                      onClick={() => setShowMobileInput(true)} 
                      className="text-blue-600 hover:underline font-bold text-xs bg-blue-50 px-2 py-1 rounded"
                    >
                      + Add Mobile Number
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                      <input 
                        type="text" 
                        value={newMobile} 
                        onChange={(e) => setNewMobile(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                        placeholder="Enter Number"
                      />
                      <button onClick={handleAddMobile} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                      <button onClick={() => setShowMobileInput(false)} className="text-gray-400 px-2 text-xs">✕</button>
                    </div>
                  )}
                </>
              )}
            </div>

            {user.isAdmin && <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">ADMIN</span>}
          </div>

          <div className="mt-6 md:mt-0 flex flex-col gap-3">
             <button onClick={() => setShowPassForm(!showPassForm)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition">
               {showPassForm ? "Cancel" : "Change Password"}
             </button>
             {user.isAdmin && (
               <button onClick={() => navigate("/admin")} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-700 transition">
                 Admin Dashboard
               </button>
             )}
             <button onClick={handleLogout} className="px-6 py-2 border border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 transition">
               Logout
             </button>
          </div>
        </div>

        {/* --- PASSWORD FORM (Same as before) --- */}
        {showPassForm && (
          <div className="bg-slate-800 rounded-xl shadow-xl p-8 mb-8 text-white animate-fade-in-down">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Security Check</h2>
            {passStep === 1 ? (
              <div className="text-center">
                <p className="text-gray-300 mb-6">We will send a code to <strong>{user.email}</strong>.</p>
                <button onClick={sendOtp} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition">
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
                {passMsg && <div className="text-red-400 text-center mt-4 font-bold">{passMsg}</div>}
              </div>
            ) : (
              <form onSubmit={updatePassword} className="max-w-md mx-auto space-y-4">
                 {passMsg && <div className={`text-center font-bold mb-2 ${passMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{passMsg}</div>}
                 <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-center tracking-[0.5em] outline-none" placeholder="0000" maxLength="4" required />
                 <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 rounded bg-slate-900 border border-slate-600 outline-none" placeholder="New Password" required />
                 <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="w-full p-3 rounded bg-slate-900 border border-slate-600 outline-none" placeholder="Confirm Password" required />
                 <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-lg transition">{loading ? "Updating..." : "Verify & Update"}</button>
              </form>
            )}
          </div>
        )}

        {/* --- RECENTLY VIEWED (Same as before) --- */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Recently Viewed</h2>
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>You haven't viewed any products yet.</p>
              <Link to="/products" className="text-blue-500 font-bold hover:underline mt-2 inline-block">Go to Shop</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group block">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-40 mb-3 relative">
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
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