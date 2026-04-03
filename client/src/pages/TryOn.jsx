import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ARCamera from '../components/ar/ARCamera';
import ProductSwitcher from '../components/ar/ProductSwitcher';

const TryOn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products } = useSelector(state => state.products);
  
  const arProducts = products.filter(p => p.arEnabled);
  const [currentProduct, setCurrentProduct] = useState(arProducts[0] || null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!currentProduct && arProducts.length > 0) {
      setCurrentProduct(arProducts[0]);
    }
  }, [arProducts, currentProduct]);

  if (!currentProduct) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white' }}>
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: '#000', zIndex: 9999 }}>
      {/* Top Navigation Overlay */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, 
        padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', padding: '0.8rem', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ color: 'white', fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>{currentProduct.name}</h1>
        <button onClick={() => navigate('/cart')} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: 'none', padding: '0.8rem', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <ShoppingCart size={24} />
        </button>
      </div>

      {/* AR Camera Viewport */}
      <ARCamera currentProduct={currentProduct} />

      {/* Product Detail Overlay */}
      <div style={{
        position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(15px)', borderRadius: '16px',
        padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '90%', maxWidth: '400px', zIndex: 10
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currentProduct.category.toUpperCase()}</div>
          <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>${currentProduct.price.toFixed(2)}</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold' }}>
          Add to Cart
        </button>
      </div>

      {/* Switcher */}
      <ProductSwitcher 
        products={arProducts} 
        currentProduct={currentProduct} 
        onSelectProduct={setCurrentProduct} 
      />
    </div>
  );
};

export default TryOn;
