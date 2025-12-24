import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-red-500 bg-slate-800" : "text-gray-300 hover:bg-slate-800 hover:text-white";
  };

  // If menu is closed, don't render anything (or render hidden for animation)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      
      {/* 1. BLACK BACKDROP (Clicking this closes the menu) */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 2. SIDE DRAWER (The actual menu) */}
      {/* w-[75%] makes it cover 75% of the width */}
      <div className="relative w-[75%] h-full bg-slate-900 shadow-2xl border-r border-slate-700 flex flex-col p-6 animate-slide-in">
        
        {/* CLOSE BUTTON (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-slate-800 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* BRAND LOGO */}
        <div className="mb-10 mt-4">
          <span className="text-3xl font-extrabold italic tracking-wide uppercase">
            <span className="text-blue-500">Gs</span>
            <span className="text-red-600">Cars</span>
          </span>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Menu</p>
        </div>

        {/* LINKS */}
        <nav className="flex flex-col space-y-3">
          <Link 
            to="/" 
            onClick={onClose} 
            className={`px-4 py-3 rounded-xl text-lg font-medium transition ${isActive('/')}`}
          >
            Home
          </Link>
          
          <Link 
            to="/products" 
            onClick={onClose} 
            className={`px-4 py-3 rounded-xl text-lg font-medium transition ${isActive('/products')}`}
          >
            Shop Catalog
          </Link>

          <Link 
            to="/admin" 
            onClick={onClose} 
            className={`px-4 py-3 rounded-xl text-lg font-medium transition ${isActive('/admin')}`}
          >
            Admin Dashboard
          </Link>
        </nav>

        {/* FOOTER TEXT */}
        <div className="mt-auto text-gray-500 text-xs text-center">
          &copy; {new Date().getFullYear()} GsCars App
        </div>

      </div>
    </div>
  );
};

export default MobileMenu;