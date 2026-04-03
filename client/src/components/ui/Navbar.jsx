import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Box, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ background: 'var(--gradient-brand)', padding: '0.5rem', borderRadius: '8px' }}>
          <Box color="white" size={24} />
        </div>
        <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Aura AR</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/products" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>
          Catalog
        </Link>
        <Link to="/try-on" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-secondary)'}>
          Virtual Try-On
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </button>
        <Link to="/cart" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag size={20} />
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
