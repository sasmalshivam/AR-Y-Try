import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedProductCard from './AnimatedProductCard';
import '../styles/ProductsGallery.css';

const AnimatedProductsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = {
    eyewear: [
      { id: 1, name: 'Classic Sunglasses', price: '149.99', image: '/src/assets/products/eyewear/product-1.jpg', label: 'NEW' },
      { id: 2, name: 'Blue Light Glasses', price: '89.99', image: '/src/assets/products/eyewear/product-2.jpg', label: 'TRENDING' },
      { id: 3, name: 'Aviator Pro', price: '199.99', image: '/src/assets/products/eyewear/product-3.jpg', label: 'POPULAR' },
    ],
    fashion: [
      { id: 4, name: 'Premium T-Shirt', price: '59.99', image: '/src/assets/products/fashion/product-1.jpg', label: 'NEW' },
      { id: 5, name: 'Casual Jacket', price: '179.99', image: '/src/assets/products/fashion/product-2.jpg', label: 'SALE' },
      { id: 6, name: 'Summer Dress', price: '129.99', image: '/src/assets/products/fashion/product-3.jpg', label: 'HOT' },
    ],
    furniture: [
      { id: 7, name: 'Modern Sofa', price: '799.99', image: '/src/assets/products/furniture/product-1.jpg', label: 'NEW' },
      { id: 8, name: 'Lounge Chair', price: '399.99', image: '/src/assets/products/furniture/product-2.jpg', label: 'POPULAR' },
    ],
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return Object.values(products).flat();
    }
    return products[selectedCategory] || [];
  };

  const categoryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.05,
      backgroundColor: '#A0522D',
      color: '#FAF0E6',
      transition: { duration: 0.2 },
    },
    active: {
      backgroundColor: '#5C3317',
      color: '#FAF0E6',
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="products-gallery">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="gallery-header"
      >
        <h2 className="gallery-title">Shop Our Collections</h2>
        <p className="gallery-subtitle">Explore our curated selection with AR Try-On</p>
      </motion.div>

      <motion.div
        className="category-filters"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: false }}
      >
        {['all', 'eyewear', 'fashion', 'furniture'].map((cat) => (
          <motion.button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            onClick={() => setSelectedCategory(cat)}
            animate={selectedCategory === cat ? 'active' : 'idle'}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="products-grid"
        variants={categoryVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
      >
        {getFilteredProducts().map((product, index) => (
          <AnimatedProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </section>
  );
};

export default AnimatedProductsGallery;
