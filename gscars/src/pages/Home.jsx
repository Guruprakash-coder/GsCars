import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { baseUrl } from '../url'; // <--- 1. IMPORT BASEURL

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // <--- 2. USE BASEURL HERE
        const res = await axios.get(`${baseUrl}/api/products/all`);
        setFeaturedProducts(res.data); 
        setLoading(false); 
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-extrabold italic mb-4 leading-tight">
              Upgrade Your <span className="text-red-600">Drive</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Premium accessories for the modern car enthusiast. 
              From luxury interiors to high-performance lighting.
            </p>
            <Link to="/products" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105 inline-block">
              Shop Full Catalog
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-blue-600 to-slate-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-700">
              <span className="text-4xl font-bold italic">GsCars</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED SECTION */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12 uppercase tracking-wide">
          Featured <span className="text-red-600">Collections</span>
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading amazing products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group border border-gray-100 relative block">
                 {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                 <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full z-10 ${product.compatibility === 'Universal' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {product.compatibility}
                 </span>
                 <div className="h-56 overflow-hidden bg-gray-100 relative">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                 </div>
                 <div className="p-5">
                   <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition">{product.name}</h3>
                   <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">{product.category}</p>
                   <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.originalPrice > product.price && <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>}
                        <span className="text-red-600 font-extrabold text-xl">₹{product.price}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 hover:underline">View Details &rarr;</span>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && featuredProducts.length === 0 && (
          <div className="text-center text-gray-400">No featured products found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;