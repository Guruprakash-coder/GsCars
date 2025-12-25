import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { baseUrl } from '../url'; 

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [historyProducts, setHistoryProducts] = useState([]); // NEW STATE
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Featured
        const featRes = await axios.get(`${baseUrl}/api/products/featured`);
        setFeaturedProducts(featRes.data);

        // 2. Get History (If logged in)
        if (user) {
          const histRes = await axios.get(`${baseUrl}/api/users/history/${user._id}`);
          setHistoryProducts(histRes.data);
        }
        
        setLoading(false); 
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ... HERO SECTION (Keep same) ... */}
      <div className="bg-slate-900 text-white py-10 md:py-20 px-6">
         {/* ... (Your existing hero code) ... */}
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold italic mb-4 leading-tight">
                Upgrade Your <span className="text-red-600">Drive</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Premium accessories for the modern car enthusiast.
              </p>
              <Link to="/products" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105 inline-block">
                Shop Full Catalog
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop" alt="Luxury Sports Car" className="w-full max-w-md rounded-xl shadow-2xl border-4 border-slate-700 hover:scale-105 transition duration-500" />
            </div>
          </div>
      </div>


      {/* FEATURED SECTION */}
      <div className="container mx-auto px-6 py-16 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-8 md:mb-12 uppercase tracking-wide">
          Featured <span className="text-red-600">Collections</span>
        </h2>
        {/* ... (Your existing featured grid code) ... */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group border border-gray-100 relative block">
                 {/* ... cards content ... */}
                 <div className="h-32 md:h-56 overflow-hidden bg-gray-100 relative">
                   <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                 </div>
                 <div className="p-3 md:p-5">
                   <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                   <span className="text-red-600 font-extrabold text-base md:text-xl">₹{product.price}</span>
                 </div>
              </Link>
            ))}
         </div>
      </div>

      {/* --- NEW SECTION: PREVIOUSLY VIEWED --- */}
      {historyProducts.length > 0 && (
        <div className="container mx-auto px-6 py-16 bg-slate-100">
           <div className="flex items-center gap-2 mb-6">
             <span className="text-2xl">🕒</span>
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-wide">
               Previously <span className="text-blue-600">Viewed</span>
             </h2>
           </div>
           
           {/* SCROLLABLE ROW (Swipable) */}
           <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
             {historyProducts.map((product) => (
               <Link 
                 to={`/product/${product._id}`} 
                 key={product._id} 
                 className="min-w-[160px] md:min-w-[220px] bg-white rounded-xl shadow hover:shadow-lg transition snap-start border border-gray-200"
               >
                 <div className="h-28 md:h-40 overflow-hidden bg-gray-50 rounded-t-xl">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                 </div>
                 <div className="p-3">
                    <h3 className="text-xs md:text-sm font-bold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-blue-600 font-bold text-sm">₹{product.price}</p>
                 </div>
               </Link>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default Home;