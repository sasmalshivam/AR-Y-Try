import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { motion as Motion } from 'framer-motion';
import { RevealFromLeft, RevealFromRight } from '../components/ScrollAnimations';
import Button from '../components/ui/Button';
import { ArrowLeft, Box, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const { productDetails: product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const mockProduct = product || {
    _id: id,
    name: 'Cyberpunk Goggles',
    price: 9600,
    category: 'eyewear',
    arEnabled: true,
    description: 'Immersive augmented reality goggles equipped with visual distortion tech to seamlessly blend digital overlay logic onto your physical aesthetic.',
    images: [] // no images yet
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: mockProduct._id,
      name: mockProduct.name,
      image: mockProduct.images?.[0] || 'https://via.placeholder.com/150',
      price: mockProduct.price,
      countInStock: mockProduct.countInStock || 10,
      qty
    }));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', transition: 'var(--transition-fast)' }} onMouseOver={e=>e.target.style.color='var(--text-primary)'} onMouseOut={e=>e.target.style.color='var(--text-secondary)'}>
        <ArrowLeft size={20} /> Back to Catalog
      </Link>
      
      {loading ? (
        <div>Loading product...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left: Product Image & AR Experience */}
          <RevealFromLeft delay={0.1}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: 'var(--bg-secondary)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {mockProduct.images?.[0] ? (
                <Motion.img
                  src={mockProduct.images[0]}
                  alt={mockProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <Box size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No Image Available</p>
                </div>
              )}

              <div style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
                {(mockProduct.arEnabled || mockProduct.category === 'fashion' || mockProduct.category === 'eyewear') && (
                  <Motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => navigate('/try-on', { state: { productId: mockProduct._id || mockProduct.id } })}
                      style={{ padding: '1rem 3rem', borderRadius: '30px', gap: '0.5rem', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                    >
                      <Box size={24} /> Try On in AR
                    </Button>
                  </Motion.div>
                )}
              </div>
            </div>
          </RevealFromLeft>

          {/* Right: Product Info */}
          <RevealFromRight delay={0.15}>
            <div>
              <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--accent-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '1rem' }}>
                {mockProduct.category}
              </div>
            
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>{mockProduct.name}</h1>
            <p className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>
              {formatPrice(mockProduct.price)}
            </p>
            
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {mockProduct.description || "No description provided for this product yet. Get ready for a premium experience."}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>-</button>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, padding: '0 1rem' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(mockProduct.countInStock || 10, qty + 1))} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>+</button>
              </div>
              
              <Button onClick={handleAddToCart} style={{ flex: 1, padding: '1.2rem', fontSize: '1.1rem', gap: '0.5rem' }}>
                <ShoppingCart size={22} /> Add to Bag
              </Button>
            </div>
          </div>
          </RevealFromRight>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
