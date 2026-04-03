import React from 'react';

const ProductSwitcher = ({ products, currentProduct, onSelectProduct }) => {
  return (
    <div style={{
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
    }}>
      {products.map(prod => (
        <button
          key={prod._id || prod.id}
          onClick={() => onSelectProduct(prod)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: (currentProduct?._id || currentProduct?.id) === (prod._id || prod.id) ? '2px solid var(--accent-light)' : '2px solid transparent',
            background: `url(${prod.images?.[0] || prod.image}) center/cover`,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'transform 0.2s, border 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      ))}
    </div>
  );
};

export default ProductSwitcher;
