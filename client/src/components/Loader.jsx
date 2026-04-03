import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = ({ onLoaded }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep loader for 2.5s for brand impact / initialization
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => onLoaded(), 800); // Notify App to render main content
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className={`global-loader ${isFading ? 'fade-out' : ''}`}>
      <div className="loader-lottie-wrapper">
        <DotLottieReact src="/logo.lottie" loop autoplay />
      </div>
      <div className="loader-text">INITIALIZING ENGINE...</div>
    </div>
  );
};

export default Loader;
