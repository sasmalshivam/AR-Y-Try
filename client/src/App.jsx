import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import TryOn from './pages/TryOn';
import Roadmap from './pages/Roadmap';
import CustomCursor from './components/CustomCursor';
import Sandbox from './pages/Sandbox';

function App() {
  return (
    <Router>
      <CustomCursor />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
