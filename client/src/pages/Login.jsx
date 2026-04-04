import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import Button from '../components/ui/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '140px 60px 60px', minHeight: '100vh', background: 'var(--beige)', position: 'relative' }}>
      <Navbar />

      <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(160,82,45,0.15)', padding: '60px 40px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 60px rgba(92,51,23,0.08)' }}>
          
          <div style={{ fontFamily: '"Roboto", sans-serif', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#A0522D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '1px', background: '#A0522D' }} />
            Access Portal
            <div style={{ width: '20px', height: '1px', background: '#A0522D' }} />
          </div>
          
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '48px', color: '#3E2723', fontWeight: 700, margin: '0 0 40px 0', lineHeight: 1 }}>
            Sign In
          </h1>

          {error && (
            <div style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#c0392b', fontFamily: '"Roboto", sans-serif', fontSize: '12px', marginBottom: '24px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Roboto", sans-serif', fontSize: '11px', color: '#5C3317', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'rgba(245,240,232,0.8)', border: '1.5px solid rgba(160,82,45,0.25)', color: '#3E2723', padding: '16px', fontFamily: '"Roboto", sans-serif', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s', borderRadius: '4px' }}
                onFocus={(e) => e.target.style.borderColor = '#A0522D'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Roboto", sans-serif', fontSize: '11px', color: '#5C3317', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'rgba(245,240,232,0.8)', border: '1.5px solid rgba(160,82,45,0.25)', color: '#3E2723', padding: '16px', fontFamily: '"Roboto", sans-serif', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s', borderRadius: '4px' }}
                onFocus={(e) => e.target.style.borderColor = '#A0522D'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
                required
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '18px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', background: '#5C3317', color: '#FAF0E6', border: 'none', cursor: 'pointer', fontFamily: '"Roboto", sans-serif', fontWeight: 600, marginTop: '8px', transition: 'all 0.3s', borderRadius: '4px' }}
              onMouseOver={e => e.currentTarget.style.background = '#3E2723'}
              onMouseOut={e => e.currentTarget.style.background = '#5C3317'}>
              {loading ? 'Authenticating...' : 'Enter'}
            </button>
          </form>

          <div style={{ marginTop: '32px', fontFamily: '"Roboto", sans-serif', fontSize: '13px', color: '#5C3317', textAlign: 'center' }}>
            New to AR-Y-TRY?{' '}
            <Link to="/register" style={{ color: '#A0522D', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #A0522D', paddingBottom: '2px' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '120px' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
