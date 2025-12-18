import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../url'; // Import it

// ... inside axios ...
//axios.get(`${baseUrl}/api/products/featured`) // Use it
const ProductDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. FETCH PRODUCT DATA
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/products/find/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 2. WHATSAPP CLICK HANDLER
  const handleBuyClick = () => {
    const phoneNumber = "919360666663"; // REPLACE with your father's number
    const message = `Hello, I want to buy *${product.name}* (Price: ₹${product.price}). Is it in stock?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Details...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found.</div>;

  // Calculate Discount
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        
        {/* BREADCRUMB (Back Button) */}
        <Link to="/products" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">
          &larr; Back to Catalog
        </Link>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="md:w-1/2 bg-gray-100 p-8 flex items-center justify-center relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-[400px] w-auto object-contain drop-shadow-2xl hover:scale-105 transition duration-500" 
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
               <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg">
                 {discount}% OFF
               </div>
            )}
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
              {product.category}
            </span>
            
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="flex items-end space-x-4 mb-6">
              <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Compatibility Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Compatibility</h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibility === 'Universal' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                    ✅ Universal Fit
                  </span>
                ) : (
                  <>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                      Specific Cars:
                    </span>
                    {product.compatibleCars.map((car, index) => (
                      <span key={index} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-full">
                        {car}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "No specific description available for this product. Contact us for more details."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleBuyClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                 <span>Buy on WhatsApp</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                 </svg>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;