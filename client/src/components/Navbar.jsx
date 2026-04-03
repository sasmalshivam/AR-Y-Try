import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        <div className="logo-icon"></div>
        AR<span>-Y-</span>TRY
      </Link>
      <ul className="nav-links">
        <li><Link to="/products" style={{ textDecoration: 'none' }}>Catalog</Link></li>
        <li><Link to="/sandbox" style={{ textDecoration: 'none' }}>Avatar Sandbox</Link></li>
        <li><Link to="/try-on" style={{ textDecoration: 'none' }}>Virtual Try-On</Link></li>
        <li><Link to="/roadmap" style={{ textDecoration: 'none' }}>Roadmap</Link></li>
      </ul>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {userInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#A0522D', fontFamily: '"Roboto", sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {userInfo.name.split(' ')[0]}
            </span>
            <button onClick={() => dispatch(logout())} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'var(--cream)', cursor: 'pointer', display: 'flex', padding: '8px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--gold)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
              <User size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'var(--cream)', cursor: 'pointer', display: 'flex', padding: '8px', transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--gold)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
            <User size={18} />
          </Link>
        )}
        <Link to="/cart" className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', textDecoration: 'none', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <div style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--gold)', color: 'var(--ink)', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>
                {cartCount}
              </div>
            )}
          </div>
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
