import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); 
  const [isOpen, setIsOpen] = useState(false); 

  const isActive = (path) => {
    return location.pathname === path ? "text-red-500" : "text-white hover:text-red-400";
  };

  return (
    <nav className="bg-slate-900 shadow-lg border-b-4 border-red-600 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        
        <div className="flex justify-between items-center">
          
          {/* 1. MOBILE HAMBURGER BUTTON (Moved to Top = Left Side) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 2. BRAND NAME (Now appears on the Right on Mobile) */}
          <Link to="/" className="flex flex-col group items-end md:items-start"> {/* Changed items-start to items-end for right align on mobile if desired, or keep default */}
            <span className="text-3xl font-extrabold tracking-wide uppercase italic leading-none transition duration-300 group-hover:scale-105">
              <span className="text-blue-500">Gs</span>
              <span className="text-red-600">Cars</span>
            </span>
            <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1 ml-1">
              Automobile Accessories
            </span>
          </Link>

          {/* 3. DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-8 font-medium items-center">
            <Link to="/" className={`${isActive('/')} transition duration-300`}>Home</Link>
            <Link to="/products" className={`${isActive('/products')} transition duration-300`}>Shop</Link>
            <Link to="/admin" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg transform hover:-translate-y-0.5">
              Admin Login
            </Link>
          </div>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col items-center bg-slate-800 rounded-xl p-6 border border-slate-700">
            <Link to="/" onClick={() => setIsOpen(false)} className={`text-xl ${isActive('/')}`}>Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className={`text-xl ${isActive('/products')}`}>Shop Catalog</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="px-8 py-3 bg-blue-600 text-white rounded-full w-full text-center">Admin Login</Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;