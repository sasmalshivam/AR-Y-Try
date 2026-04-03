import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartQty } from '../store/slices/cartSlice';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector(state => state.cart.cartItems);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQtyChange = (item, diff) => {
    const newQty = Math.max(1, Math.min(item.countInStock || 10, item.qty + diff));
    if (newQty !== item.qty) {
      dispatch(updateCartQty({ product: item.product, qty: newQty }));
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="animate-fade-in" style={{ padding: '140px 60px 60px', minHeight: '100vh', background: 'var(--ink)', position: 'relative' }}>
      <Navbar />

      {/* Ambient background glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'rgba(132, 148, 255, 0.04)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(201, 190, 255, 0.03)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '60px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', cursor: 'none', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='var(--gold)'; }} onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Your Bag
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 300, lineHeight: 1, margin: 0, color: 'var(--cream)' }}>
              Order Contents
            </h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
            <ShoppingBag size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: 'var(--cream)', fontWeight: 300, marginBottom: '16px' }}>Your bag is empty</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"Space Mono", monospace', fontSize: '12px', letterSpacing: '1px', marginBottom: '32px', textTransform: 'uppercase' }}>Discover something extraordinary.</p>
            <Link to="/products" style={{ textDecoration: 'none' }}>
              <Button style={{ padding: '16px 32px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>Explore Catalog <ArrowRight size={16}/></Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 3fr)', gap: '60px' }}>
            
            {/* Left: Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontFamily: '"Space Mono", monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                <span>Item</span>
                <span>Actions</span>
              </div>
              
              {cartItems.map((item, index) => (
                <div key={`${item.product}-${index}`} style={{ display: 'flex', gap: '32px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', transition: 'all 0.3s ease' }} 
                     onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(132, 148, 255, 0.2)'; }}
                     onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                  
                  <div style={{ position: 'relative', width: '120px', height: '140px', background: 'var(--ink)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Premium Selection
                    </div>
                    <Link to={`/products/${item.product}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '28px', color: 'var(--cream)', fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, margin: '0 0 16px 0', lineHeight: 1.1 }}>
                        {item.name}
                      </h3>
                    </Link>
                    <div style={{ fontSize: '18px', color: 'var(--cream)', fontWeight: 300, fontFamily: '"Space Mono", monospace', marginTop: 'auto' }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '24px' }}>
                    <button onClick={() => handleRemove(item.product)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'none', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#ef4444'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
                      <Trash2 size={20} />
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '4px' }}>
                      <button onClick={() => handleQtyChange(item, -1)} style={{ background: 'transparent', border: 'none', color: 'var(--cream)', cursor: 'none', padding: '8px 12px', fontSize: '16px' }}>-</button>
                      <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '12px', padding: '0 12px', minWidth: '40px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => handleQtyChange(item, 1)} style={{ background: 'transparent', border: 'none', color: 'var(--cream)', cursor: 'none', padding: '8px 12px', fontSize: '16px' }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right: Order Summary */}
            <div style={{ position: 'sticky', top: '140px', alignSelf: 'start', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', backdropFilter: 'blur(10px)' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: 'var(--cream)', fontWeight: 300, margin: '0 0 32px 0', lineHeight: 1 }}>
                  Summary
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Space Mono", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span style={{ color: 'var(--cream)' }}>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"Space Mono", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    <span>Shipping</span>
                    <span style={{ color: 'var(--gold)' }}>Complimentary</span>
                  </div>
                </div>
                
                <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)', marginBottom: '32px' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>Estimated Total</span>
                  <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', color: 'var(--cream)', lineHeight: 1 }}>${cartSubtotal.toFixed(2)}</span>
                </div>
                
                <Button style={{ width: '100%', padding: '20px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', justifyContent: 'center' }}>
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
                
                <div style={{ marginTop: '24px', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Secure encypted transaction
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
