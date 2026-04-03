import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AnimatedProductCard.css';

const AnimatedProductCard = ({ product, index }) => {
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
      scale: 1.08,
      filter: 'brightness(1.1)',
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const labelVariants = {
    rest: { opacity: 0, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="animated-product-card"
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="product-image-wrapper"
        initial="rest"
        whileHover="hover"
        variants={imageVariants}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <motion.div
          className="product-label"
          variants={labelVariants}
        >
          {product.label}
        </motion.div>
      </motion.div>
      <motion.div
        className="product-info"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      >
        <h3>{product.name}</h3>
        <p className="product-price">${product.price}</p>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedProductCard;
