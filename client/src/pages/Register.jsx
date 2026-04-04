import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inputStyle = {
  background: 'rgba(245,240,232,0.8)',
  border: '1.5px solid rgba(160,82,45,0.25)',
  color: '#3E2723',
  padding: '16px',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s',
  borderRadius: '4px',
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontFamily: "'Roboto', sans-serif",
  fontSize: '11px',
  color: '#5C3317',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '2px',
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
    } else {
      setMessage('');
      dispatch(register({ name, email, password, role }));
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '140px 60px 60px', minHeight: '100vh', background: 'var(--beige)', position: 'relative' }}>
      <Navbar />

      <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        <div style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(160,82,45,0.15)', padding: '60px 40px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 60px rgba(92,51,23,0.08)', borderRadius: '4px' }}>

          {/* Header */}
          <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#A0522D', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '1px', background: '#A0522D' }} />
            Create Your Account
            <div style={{ width: '20px', height: '1px', background: '#A0522D' }} />
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', color: '#3E2723', fontWeight: 700, margin: '0 0 8px 0', lineHeight: 1 }}>
            Register
          </h1>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '13px', color: '#5C3317', opacity: 0.75, marginBottom: '36px', textAlign: 'center' }}>
            Join AR-Y-TRY and start trying on styles virtually
          </p>

          {/* Errors */}
          {(error || message) && (
            <div style={{ width: '100%', padding: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#c0392b', fontFamily: "'Roboto', sans-serif", fontSize: '13px', marginBottom: '24px', textAlign: 'center', borderRadius: '4px' }}>
              {message || error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#A0522D'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#A0522D'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#A0522D'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Account Type</label>
              <select
                value={role} onChange={e => setRole(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#A0522D'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,82,45,0.25)'}
              >
                <option value="user">Personal Shopper</option>
                <option value="business">Business Vendor</option>
              </select>
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '18px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', background: '#5C3317', color: '#FAF0E6', border: 'none', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontWeight: 700, marginTop: '8px', transition: 'all 0.3s', borderRadius: '4px' }}
              onMouseOver={e => e.currentTarget.style.background = '#3E2723'}
              onMouseOut={e => e.currentTarget.style.background = '#5C3317'}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', fontFamily: "'Roboto', sans-serif", fontSize: '13px', color: '#5C3317', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A0522D', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #A0522D', paddingBottom: '2px' }}>
              Sign In
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

export default Register;
