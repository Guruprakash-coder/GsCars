import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Admin from './pages/Admin';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup'; // <--- 1. IMPORT THIS
import PrivateRoute from './components/PrivateRoute';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> 
      <Navbar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* <--- 2. ADD THIS ROUTE */}
          
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

      <Footer />
    </div>
  );
}

export default App;