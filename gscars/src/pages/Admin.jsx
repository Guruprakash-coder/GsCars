import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../url'; // Import it

// ... inside axios ...
//axios.get(`${baseUrl}/api/products/featured`) // Use it
const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState("");

  // STATE: EDIT MODE (If this has an ID, we are editing. If null, we are adding)
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', 
    price: '', 
    originalPrice: '', // NEW FIELD
    category: 'Interior', 
    image: '',
    compatibility: 'Universal', 
    compatibleCars: '', 
    isFeatured: false, 
    description: ''
  });

  // 1. FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // CHANGE THIS:
// const res = await axios.get(`${baseUrl}/api/products/featured`);

// TO THIS:
const res = await axios.get(`${baseUrl}/api/products/all`);
        setProducts(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, [refresh]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 2. HANDLE SUBMIT (Smart: Decides between ADD or UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process the cars list
      const finalData = {
        ...formData,
        images: formData.images.split(',').map(url => url.trim()),
        compatibleCars: formData.compatibility === 'Specific' 
          ? (typeof formData.compatibleCars === 'string' ? formData.compatibleCars.split(',') : formData.compatibleCars)
          : []
      };

      if (editId) {
        // --- UPDATE MODE ---
        await axios.put(`${baseUrl}/api/products/update/${editId}`, finalData);
        setMessage("✅ Product Updated Successfully!");
      } else {
        // --- ADD MODE ---
        await axios.post(`${baseUrl}/api/products/add`, finalData);
        setMessage("✅ Product Added Successfully!");
      }

      setRefresh(!refresh);
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving product.");
    }
  };

  // 3. EDIT CLICK HANDLER (Fills the form)
  const handleEdit = (product) => {
    setEditId(product._id); // Turn on Edit Mode
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price, // Fallback
      category: product.category,
      image: product.image,
      compatibility: product.compatibility,
      compatibleCars: product.compatibleCars.join(', '), // Convert Array back to String
      isFeatured: product.isFeatured,
      description: product.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see form
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`${baseUrl}/api/products/delete/${id}`);
      setRefresh(!refresh);
    }
  };

  const resetForm = () => {
    setEditId(null); // Turn off Edit Mode
    setFormData({
      name: '', price: '', originalPrice: '', category: 'Interior', image: '',
      compatibility: 'Universal', compatibleCars: '', isFeatured: false, description: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* FORM SECTION */}
        <div className="bg-slate-900 p-8 rounded-xl shadow-2xl border border-slate-700 mb-10">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white">
              {editId ? <span className="text-yellow-500">Edit Product</span> : <span className="text-green-500">Add New Product</span>}
            </h2>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">Logout</button>
          </div>

          {message && <div className="bg-blue-600 text-white p-3 rounded mb-4 text-center">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-sm block">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600"/>
              </div>
              {/* PRICE FIELDS */}
              <div>
                <label className="text-gray-400 text-sm block">Original MRP (₹)</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600 focus:border-red-500"/>
              </div>
              <div>
                <label className="text-gray-400 text-sm block">Selling Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600 focus:border-green-500"/>
              </div>
            </div>

            {/* KEEP REST OF THE FORM (Category, Image, Compatibility, Description) SAME AS BEFORE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm block">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600"><option>Interior</option><option>Exterior</option><option>Lighting</option><option>Car Care</option><option>Electronics</option></select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block">Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} required className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600"/>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded border border-slate-700">
               <label className="text-gray-300 font-bold mb-3 block">Compatibility</label>
               <div className="flex items-center space-x-6 mb-4">
                <label className="flex items-center text-gray-400"><input type="radio" name="compatibility" value="Universal" checked={formData.compatibility === 'Universal'} onChange={handleChange} className="mr-2"/> Universal</label>
                <label className="flex items-center text-gray-400"><input type="radio" name="compatibility" value="Specific" checked={formData.compatibility === 'Specific'} onChange={handleChange} className="mr-2"/> Specific Car</label>
               </div>
               {formData.compatibility === 'Specific' && <input type="text" name="compatibleCars" value={formData.compatibleCars} onChange={handleChange} className="w-full bg-slate-900 text-white p-3 rounded border border-slate-600" placeholder="Swift, City..."/>}
            </div>

            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..." className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600 h-24"></textarea>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white font-bold"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 mr-3 accent-red-600"/> Featured Product?</label>
              
              <div className="space-x-4">
                {editId && <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white">Cancel Edit</button>}
                <button type="submit" className={`px-8 py-3 rounded-full font-bold shadow-lg text-white ${editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* LIST SECTION */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700">
           <h2 className="text-2xl font-bold text-white mb-6">Product List</h2>
           {/* TABLE */}
           <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-400">
              <thead className="text-xs uppercase bg-slate-800 text-gray-200">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">MRP / Price</th>
                  <th className="px-4 py-3">Featured?</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-800 hover:bg-slate-800">
                    <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="line-through text-red-500 text-xs mr-2">₹{p.originalPrice}</span>
                      <span className="text-green-400 font-bold">₹{p.price}</span>
                    </td>
                    <td className="px-4 py-3">{p.isFeatured ? "⭐ Yes" : "No"}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => handleEdit(p)} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
        </div>

      </div>
    </div>
  );
};
export default Admin;