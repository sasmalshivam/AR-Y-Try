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
    <div className="animate-fade-in" style={{ padding: '140px 60px 60px', minHeight: '100vh', background: 'var(--ink)', position: 'relative' }}>
      <Navbar />

      {/* Ambient background glows */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'rgba(132, 148, 255, 0.04)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(201, 190, 255, 0.03)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '60px 40px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            Access Portal
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          </div>
          
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', color: 'var(--cream)', fontWeight: 300, margin: '0 0 40px 0', lineHeight: 1 }}>
            Sign In
          </h1>

          {error && (
            <div style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontFamily: '"Space Mono", monospace', fontSize: '12px', marginBottom: '24px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '16px', fontFamily: '"Space Mono", monospace', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', padding: '16px', fontFamily: '"Space Mono", monospace', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                required
              />
            </div>

            <Button type="submit" style={{ width: '100%', padding: '20px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', justifyContent: 'center', marginTop: '16px' }}>
              {loading ? 'Authenticating...' : 'Enter System'}
            </Button>
          </form>

          <div style={{ marginTop: '32px', fontFamily: '"Space Mono", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            New to ARYAA?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}>
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
