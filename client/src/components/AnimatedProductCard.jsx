import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import '../styles/AnimatedProductCard.css';

const AnimatedProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  
  const isARCompatible = product.id >= 1 && product.id <= 6; // Eyewear and Fashion

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const imageVariants = {
    rest: {
      scale: 1,
      filter: 'brightness(1)'
    },
    hover: {
      scale: 1.05,
      filter: 'brightness(0.9)',
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } }
  };

  const handleTryOn = (e) => {
    e.stopPropagation();
    navigate('/try-on', { state: { productId: product.id } });
  };

  return (
    <motion.div
      className="animated-product-card"
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <motion.div
        className="product-image-wrapper"
        initial="rest"
        whileHover="hover"
        variants={imageVariants}
        style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        {isARCompatible && (
          <motion.div 
            className="product-ar-overlay"
            variants={overlayVariants}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
              backdropFilter: 'blur(2px)'
            }}
          >
            <motion.button
              onClick={handleTryOn}
              whileHover={{ scale: 1.1, backgroundColor: '#c9a84c' }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#0a0a0f',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              <Camera size={18} />
              Try in AR
            </motion.button>
          </motion.div>
        )}

        <div className="product-label-chip">
          {product.label}
        </div>
      </motion.div>

      <div className="product-info-minimal">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </motion.div>
  );
};

export default AnimatedProductCard;
