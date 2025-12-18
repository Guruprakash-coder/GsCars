import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); 
  
  const isActive = (path) => {
    return location.pathname === path ? "text-red-500" : "text-white hover:text-red-400";
  };

  return (
    <nav className="bg-slate-900 shadow-lg border-b-4 border-red-600 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LEFT: Brand Name Only */}
        <Link to="/" className="flex flex-col group">
          <span className="text-3xl font-extrabold tracking-wide uppercase italic leading-none transition duration-300 group-hover:scale-105">
            <span className="text-blue-500">Gs</span>
            <span className="text-red-600">Cars</span>
          </span>
          <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1 ml-1 group-hover:text-gray-200 transition-colors">
            Automobile Accessories
          </span>
        </Link>

        {/* RIGHT: Navigation Links */}
        <div className="space-x-8 font-medium flex items-center">
          
          {/* HOME LINK */}
          <Link to="/" className={`${isActive('/')} transition duration-300 relative group`}>
            Home
            <span className={`absolute bottom-[-4px] left-0 h-0.5 bg-red-600 transition-all duration-300 ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          
          {/* SHOP LINK */}
          <Link to="/products" className={`${isActive('/products')} transition duration-300 relative group`}>
            Shop
            <span className={`absolute bottom-[-4px] left-0 h-0.5 bg-red-600 transition-all duration-300 ${location.pathname === '/products' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          
          {/* ADMIN BUTTON */}
          <Link to="/admin" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50 transform hover:-translate-y-0.5">
            Admin Login
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;