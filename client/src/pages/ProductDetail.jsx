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

  // Local product data matching the gallery
  const localProducts = {
    1: { _id: '1', name: 'Aviator Stealth', price: 11999, category: 'eyewear', arEnabled: true, description: 'Premium aviator sunglasses with stealth technology.', images: ['/src/assets/products/eyewear/1.png'] },
    2: { _id: '2', name: 'Urban Wayfarer', price: 7199, category: 'eyewear', arEnabled: true, description: 'Classic wayfarer style for urban explorers.', images: ['/src/assets/products/eyewear/2.png'] },
    3: { _id: '3', name: 'Gold Rim Lux', price: 15999, category: 'eyewear', arEnabled: true, description: 'Luxurious gold rimmed glasses.', images: ['/src/assets/products/eyewear/3.png'] },
    31: { _id: '31', name: 'Cyber Shield', price: 18999, category: 'eyewear', arEnabled: true, description: 'Advanced cyber shield eyewear.', images: ['/src/assets/products/eyewear/1.png'] },
    4: { _id: '4', name: 'Premium Classic Shirt', price: 4799, category: 'fashion', arEnabled: true, description: 'Classic premium shirt.', images: ['/src/assets/products/fashion/1.png'] },
    5: { _id: '5', name: 'Signature Navy T-Shirt', price: 14399, category: 'fashion', arEnabled: true, description: 'Signature navy t-shirt.', images: ['/src/assets/products/fashion/2.png'] },
    6: { _id: '6', name: 'Modern Fit T-Shirt', price: 10399, category: 'fashion', arEnabled: true, description: 'Modern fit t-shirt.', images: ['/src/assets/products/fashion/3.png'] },
    41: { _id: '41', name: 'Midnight Essential', price: 5299, category: 'fashion', arEnabled: true, description: 'Midnight essential shirt.', images: ['/src/assets/products/fashion/4.png'] },
    42: { _id: '42', name: 'Arctic White Tee', price: 3499, category: 'fashion', arEnabled: true, description: 'Arctic white t-shirt.', images: ['/src/assets/products/fashion/5.png'] },
    43: { _id: '43', name: 'Street Style Tee', price: 4999, category: 'fashion', arEnabled: true, description: 'Street style t-shirt.', images: ['/src/assets/products/fashion/6.png'] },
    44: { _id: '44', name: 'Urban Graphic Shirt', price: 5799, category: 'fashion', arEnabled: true, description: 'Urban graphic shirt.', images: ['/src/assets/products/fashion/7.png'] },
    45: { _id: '45', name: 'Bold Print Tee', price: 4299, category: 'fashion', arEnabled: true, description: 'Bold print t-shirt.', images: ['/src/assets/products/fashion/8.png'] },
    7: { _id: '7', name: 'Diamond Pendant', price: 24999, category: 'jewelry', arEnabled: false, description: 'Elegant diamond pendant.', images: ['/src/assets/products/jewelry/1.png'] },
    8: { _id: '8', name: 'Gold Pendant', price: 18999, category: 'jewelry', arEnabled: false, description: 'Classic gold pendant.', images: ['/src/assets/products/jewelry/2.png'] },
    71: { _id: '71', name: 'Silver Pendant', price: 12999, category: 'jewelry', arEnabled: false, description: 'Chic silver pendant.', images: ['/src/assets/products/jewelry/3.png'] },
    73: { _id: '73', name: 'Crystal Pendant', price: 16999, category: 'jewelry', arEnabled: false, description: 'Beautiful crystal pendant.', images: ['/src/assets/products/jewelry/4.png'] },
    101: { _id: '101', name: 'Ruby Rush', price: 2499, category: 'beauty', arEnabled: false, description: 'Matte ruby lipstick.', images: ['/src/assets/products/beauty/1.png'], color: { r: 180, g: 0, b: 0 } },
    102: { _id: '102', name: 'Mauve Mist', price: 2499, category: 'beauty', arEnabled: false, description: 'Satin mauve lipstick.', images: ['/src/assets/products/beauty/2.png'], color: { r: 150, g: 70, b: 120 } },
    103: { _id: '103', name: 'Nude Silk', price: 2499, category: 'beauty', arEnabled: false, description: 'Gloss nude lipstick.', images: ['/src/assets/products/beauty/1.png'], color: { r: 188, g: 130, b: 110 } },
    104: { _id: '104', name: 'Deep Plum', price: 2499, category: 'beauty', arEnabled: false, description: 'Velvet deep plum lipstick.', images: ['/src/assets/products/beauty/1.png'], color: { r: 80, g: 0, b: 50 } },
    105: { _id: '105', name: 'Sunset Coral', price: 2499, category: 'beauty', arEnabled: false, description: 'Bright sunset coral lipstick.', images: ['/src/assets/products/beauty/1.png'], color: { r: 255, g: 80, b: 60 } },
    11: { _id: '11', name: 'Modern Sofa', price: 63999, category: 'furniture', arEnabled: false, description: 'Modern lounge sofa.', images: ['/src/assets/products/furniture/product-1.jpg'] },
    12: { _id: '12', name: 'Lounge Chair', price: 31999, category: 'furniture', arEnabled: false, description: 'Comfortable lounge chair.', images: ['/src/assets/products/furniture/product-2.jpg'] },
  };

  const mockProduct = product || localProducts[id] || {
    _id: id,
    name: 'Product Not Found',
    price: 0,
    category: 'unknown',
    arEnabled: false,
    description: 'This product could not be loaded.',
    images: []
  };

  const handleAddToCart = () => {
    const cartItem = {
      product: mockProduct._id,
      name: mockProduct.name,
      image: mockProduct.images?.[0] || 'https://via.placeholder.com/150',
      price: mockProduct.price,
      countInStock: mockProduct.countInStock || 10,
      qty
    };
    console.log('Adding to cart from ProductDetail:', cartItem);
    dispatch(addToCart(cartItem));
    alert(`${mockProduct.name} added to cart!`);
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
