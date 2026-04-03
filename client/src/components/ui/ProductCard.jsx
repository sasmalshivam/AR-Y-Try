import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Eye, Plus, Check } from 'lucide-react';
import Button from './Button';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || 'https://via.placeholder.com/150',
      price: product.price,
      countInStock: product.countInStock || 10,
      qty: 1
    }));

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', cursor: 'none', transition: 'all 0.5s ease' }} 
         onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(132, 148, 255, 0.3)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(132, 148, 255, 0.03)'; }}
         onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
      
      {/* Image Container with Hover Effect */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '110%', overflow: 'hidden', backgroundColor: 'var(--ink)', marginBottom: '24px' }}>
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(255, 219, 253, 0.3)', fontFamily: '"Space Mono", monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Awaiting Visuals
          </div>
        )}
        
        {/* AR Badge */}
        {product.arEnabled && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--gold)', padding: '6px 12px', fontSize: '9px', fontWeight: 600, color: 'var(--ink)', fontFamily: '"Space Mono", monospace', textTransform: 'uppercase', letterSpacing: '2px' }}>
            AR Ready
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', letterSpacing: '2px' }}>
              {product.category}
            </span>
            <p style={{ fontWeight: 300, fontSize: '22px', color: 'var(--cream)', fontFamily: '"Cormorant Garamond", serif', margin: 0, lineHeight: 1 }}>
              ${product.price.toFixed(2)}
            </p>
          </div>
          <h3 style={{ fontSize: '26px', margin: '0', color: 'var(--cream)', fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, lineHeight: 1.2 }}>
            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'none' }}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {product.arEnabled ? (
            <Link to="/try-on" style={{ flex: 1, textDecoration: 'none', cursor: 'none' }}>
              <div style={{ background: 'transparent', color: 'var(--cream)', border: '1px solid rgba(255, 219, 253, 0.2)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'none', transition: 'all 0.4s', fontFamily: '"Space Mono", monospace', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}
                   onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                   onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 219, 253, 0.2)'; e.currentTarget.style.color = 'var(--cream)'; }}>
                <Eye size={16} />
                Try in AR
              </div>
            </Link>
          ) : (
            <div onClick={handleAddToCart} style={{ flex: 1, background: added ? 'rgba(124, 58, 237, 0.2)' : 'transparent', color: added ? 'var(--gold)' : 'var(--cream)', border: added ? '1px solid var(--gold)' : '1px solid rgba(255, 219, 253, 0.2)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'none', transition: 'all 0.4s', fontFamily: '"Space Mono", monospace', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}
                 onMouseOver={e => { if(!added){ e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)';} }}
                 onMouseOut={e => { if(!added){ e.currentTarget.style.borderColor = 'rgba(255, 219, 253, 0.2)'; e.currentTarget.style.color = 'var(--cream)';} }}>
              {added ? <Check size={16} /> : <Plus size={16} />}
              {added ? 'Added' : 'Add to Bag'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
