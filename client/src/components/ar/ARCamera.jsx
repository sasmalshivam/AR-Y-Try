import React from "react";

const ARCamera = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#000',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <img
        src="http://localhost:5000/video"
        alt="Virtual Try-On"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '16px'
        }}
      />
    </div>
  );
};

export default ARCamera;