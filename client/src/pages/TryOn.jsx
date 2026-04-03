import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ARCamera from '../components/ar/ARCamera';

const TryOn = () => {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>

      {/* 🔥 FULLSCREEN CAMERA MODE */}
      {isFullScreen ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          
          <button 
            onClick={() => setIsFullScreen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              padding: '10px',
              borderRadius: '50%',
              color: 'white'
            }}
          >
            <ArrowLeft />
          </button>

          <ARCamera />

        </div>
      ) : (

        /* 🔥 NORMAL ECOMMERCE + SIDE CAMERA */
        <div style={{ display: 'flex', height: '100%' }}>

          {/* 🛍️ LEFT SIDE (PRODUCTS) */}
          <div style={{
            width: '65%',
            padding: '20px',
            overflowY: 'auto',
            background: '#f5f5f5'
          }}>
            <h1>🔥 T-Shirts Collection</h1>

            {/* Example Products */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[1,2,3,4].map((item) => (
                <div key={item} style={{
                  width: '200px',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '10px'
                }}>
                  <img 
                    src="https://via.placeholder.com/200x250" 
                    alt="shirt"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  <h3>T-Shirt {item}</h3>
                  <button style={{ width: '100%' }}>Try On</button>
                </div>
              ))}
            </div>
          </div>

          {/* 📹 RIGHT SIDE (CAMERA 35%) */}
          <div 
            style={{
              width: '35%',
              position: 'relative',
              cursor: 'pointer',
              borderLeft: '3px solid #000'
            }}
            onClick={() => setIsFullScreen(true)}
          >
            <ARCamera />

            {/* Overlay hint */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              width: '100%',
              textAlign: 'center',
              color: 'white',
              background: 'rgba(0,0,0,0.5)',
              padding: '5px'
            }}>
              Click to Expand 🔍
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default TryOn;