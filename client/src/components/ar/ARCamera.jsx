import React, { useState, useEffect } from 'react';

const ARCamera = () => {
  const [serverOnline, setServerOnline] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if server is online
    const checkServer = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/set_category/fashion');
        if (response.ok) {
          setServerOnline(true);
        } else {
          setError("AR Server is not responding.");
        }
      } catch (err) {
        setError("Cannot connect to AR Server. Please ensure 'python ar_tryon/tryon_server.py' is running.");
      }
    };

    checkServer();
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {serverOnline ? (
        <img 
          src="http://127.0.0.1:5001/video" 
          alt="AR Try-On Stream"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setError("Stream failed. The camera might be in use by another application.")}
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white', maxWidth: '400px' }}>
          <div style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Connecting to AR Mirror...</h2>
          {error && <p style={{ color: '#ff4b4b', fontSize: '0.9rem', opacity: 0.8 }}>{error}</p>}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ARCamera;

