import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <--- 1. Import Footer
import Home from './pages/Home';
import Admin from './pages/Admin';
import Shop from './pages/Shop';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> 
      {/* Note: I added 'flex flex-col' above to make the footer stick to bottom if page is short */}
      
      <Navbar />
      
      {/* This div grows to push footer down */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>

      <Footer /> {/* <--- 2. Add Footer Here */}
    </div>
  );
}

export default App;