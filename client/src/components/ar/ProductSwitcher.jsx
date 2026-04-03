import React from 'react';
import { motion } from 'framer-motion';

const ProductSwitcher = ({ products, currentProduct, onSelectProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        maxWidth: '90vw',
        overflowX: 'auto',
        zIndex: 10
      }}
    >
      {products.map((prod, index) => (
        <motion.button
          key={prod._id || prod.id}
          onClick={() => onSelectProduct(prod)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: (currentProduct?._id || currentProduct?.id) === (prod._id || prod.id) ? '2px solid var(--accent-light)' : '2px solid transparent',
            background: `url(${prod.images?.[0] || prod.image}) center/cover`,
            cursor: 'pointer',
            flexShrink: 0,
            outline: 'none'
          }}
        />
      ))}
    </motion.div>
  );
};

export default ProductSwitcher;
