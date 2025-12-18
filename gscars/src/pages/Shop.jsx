import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link to navigate to Details Page
import { baseUrl } from '../url'; // Import it

// ... inside axios ...
// Use it
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. FILTER STATES
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCar, setSelectedCar] = useState(''); // Empty means "Show Everything"

  // 2. FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/products/featured`) ;
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shop items:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3. THE SMART FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    // Check Category
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Check Car Compatibility
    // Logic: If no car selected, show all. 
    // If car selected, show "Universal" items OR items that specifically list that car.
    const carMatch = 
      selectedCar === '' || 
      product.compatibility === 'Universal' || 
      product.compatibleCars.some(car => car.toLowerCase().includes(selectedCar.toLowerCase()));

    return categoryMatch && carMatch;
  });

  // 4. WHATSAPP CLICK HANDLER
  const handleBuyClick = (e, productName, price) => {
    e.preventDefault(); // Stop the link from opening the details page
    e.stopPropagation(); // Stop the click from bubbling up
    
    const phoneNumber = "919876543210"; // REPLACE with your father's number
    const message = `Hello, I am interested in *${productName}* (₹${price}) found on GsCars website. Is it available?`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Complete <span className="text-red-600">Catalog</span>
          </h1>
          <p className="text-gray-500">Find the perfect parts for your ride.</p>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
          
          {/* Car Search Input */}
          <div className="w-full md:w-1/3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Find for your Car</label>
            <input 
              type="text" 
              placeholder="Type Car Name (e.g. Swift)..." 
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-2 rounded focus:border-red-500 outline-none transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-1/3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-2 rounded focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Interior">Interior</option>
              <option value="Exterior">Exterior</option>
              <option value="Lighting">Lighting</option>
              <option value="Car Care">Car Care</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          {/* Result Count */}
          <div className="w-full md:w-auto text-right hidden md:block">
            <span className="text-sm font-bold text-gray-400">
              Showing {filteredProducts.length} Items
            </span>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading Catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              
              /* CARD: Wraps everything in a Link to the Details Page */
              <Link 
                to={`/product/${product._id}`} 
                key={product._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group border border-gray-100 relative flex flex-col"
              >
                
                {/* 1. DISCOUNT BADGE (Only if Original Price > Selling Price) */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-20">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Compatibility Badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full z-20 
                  ${product.compatibility === 'Universal' ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {product.compatibility}
                </span>

                {/* Image Section */}
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                </div>
                
                {/* Info Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                    {product.category}
                  </p>
                  
                  {/* PRICE DISPLAY */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      {/* Show Original Price Struck Through */}
                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
                      )}
                      <span className="text-slate-900 font-extrabold text-xl">₹{product.price}</span>
                    </div>

                    {/* WhatsApp Button */}
                    <button 
                      onClick={(e) => handleBuyClick(e, product.name, product.price)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-full transition-colors"
                      title="Buy on WhatsApp"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 py-20 bg-white rounded-xl border border-dashed border-gray-300 mt-8">
            <p className="text-lg">No products found matching your search.</p>
            <button onClick={() => {setSelectedCar(''); setSelectedCategory('All');}} className="text-blue-500 mt-2 hover:underline">
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;