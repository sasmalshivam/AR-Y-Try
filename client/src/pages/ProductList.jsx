import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Filter } from 'lucide-react';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['all', 'eyewear', 'tops', 'footwear', 'furniture', 'accessories'];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="animate-fade-in" style={{ padding: '140px 60px', minHeight: '100vh', background: 'var(--ink)', position: 'relative' }}>
      <Navbar />
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'rgba(132, 148, 255, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(201, 190, 255, 0.03)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
            03 // The Catalog
            <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '40px', color: 'var(--cream)' }}>
            Curated <em>Augmented</em> Reality Wares
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '40px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <Filter size={18} color="rgba(255, 219, 253, 0.4)" style={{ alignSelf: 'center', margin: '0 8px' }} />
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'rgba(132, 148, 255, 0.15)' : 'transparent',
                  color: activeCategory === cat ? 'var(--gold)' : 'rgba(255, 219, 253, 0.6)',
                  border: activeCategory === cat ? '1px solid var(--gold)' : '1px solid transparent',
                  padding: '8px 24px',
                  borderRadius: '30px',
                  cursor: 'none',
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s ease'
                }}
                onMouseOver={(e) => {
                  if(activeCategory !== cat) e.currentTarget.style.color = 'var(--cream)';
                }}
                onMouseOut={(e) => {
                  if(activeCategory !== cat) e.currentTarget.style.color = 'rgba(255, 219, 253, 0.6)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <span style={{ fontFamily: '"Space Mono", monospace', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', animation: 'fadeInOut 1.5s infinite' }}>Initializing Catalog...</span>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '12px', letterSpacing: '1px' }}>
            {error}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInOut { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}} />
      <Footer />
    </div>
  );
};

export default ProductList;
