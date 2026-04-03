import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedProductCard from './AnimatedProductCard';
import '../styles/ProductsGallery.css';

const AnimatedProductsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = {
    eyewear: [
      { id: 1, name: 'Aviator Stealth', price: '11999', image: '/src/assets/products/eyewear/1.png', label: 'PREMIUM', category: 'eyewear' },
      { id: 2, name: 'Urban Wayfarer', price: '7199', image: '/src/assets/products/eyewear/2.png', label: 'TRENDING', category: 'eyewear' },
      { id: 3, name: 'Gold Rim Lux', price: '15999', image: '/src/assets/products/eyewear/3.png', label: 'LUXURY', category: 'eyewear' },
      { id: 31, name: 'Cyber Shield', price: '18999', image: '/src/assets/products/eyewear/1.png', label: 'NEW', category: 'eyewear' },
    ],
    fashion: [
      { id: 4, name: 'Premium Classic Shirt', price: '4799', image: '/src/assets/products/fashion/1.png', label: 'NEW', category: 'fashion' },
      { id: 5, name: 'Signature Navy T-Shirt', price: '14399', image: '/src/assets/products/fashion/2.png', label: 'SALE', category: 'fashion' },
      { id: 6, name: 'Modern Fit T-Shirt', price: '10399', image: '/src/assets/products/fashion/3.png', label: 'HOT', category: 'fashion' },
      { id: 41, name: 'Midnight Essential', price: '5299', image: '/src/assets/products/fashion/4.png', label: 'NEW', category: 'fashion' },
      { id: 42, name: 'Arctic White Tee', price: '3499', image: '/src/assets/products/fashion/5.png', label: 'FRESH', category: 'fashion' },
      { id: 43, name: 'Street Style Tee', price: '4999', image: '/src/assets/products/fashion/6.png', label: 'TRENDING', category: 'fashion' },
      { id: 44, name: 'Urban Graphic Shirt', price: '5799', image: '/src/assets/products/fashion/7.png', label: 'BOLD', category: 'fashion' },
      { id: 45, name: 'Bold Print Tee', price: '4299', image: '/src/assets/products/fashion/8.png', label: 'NEW', category: 'fashion' },
    ],
    jewelry: [
      { id: 7, name: 'Diamond Pendant', price: '24999', image: '/src/assets/products/jewelry/1.png', label: 'ELEGANT', category: 'jewelry' },
      { id: 8, name: 'Gold Pendant', price: '18999', image: '/src/assets/products/jewelry/2.png', label: 'CLASSIC', category: 'jewelry' },
      { id: 71, name: 'Silver Pendant', price: '12999', image: '/src/assets/products/jewelry/3.png', label: 'CHIC', category: 'jewelry' },
      { id: 73, name: 'Crystal Pendant', price: '16999', image: '/src/assets/products/jewelry/4.png', label: 'NEW', category: 'jewelry' },
    ],
    beauty: [
      { id: 101, name: 'Ruby Rush', price: '2499', image: '/src/assets/products/beauty/1.png', label: 'MATTE', category: 'beauty', color: { r: 180, g: 0, b: 0 } },
      { id: 102, name: 'Mauve Mist', price: '2499', image: '/src/assets/products/beauty/2.png', label: 'SATIN', category: 'beauty', color: { r: 150, g: 70, b: 120 } },
      { id: 103, name: 'Nude Silk', price: '2499', image: '/src/assets/products/beauty/1.png', label: 'GLOSS', category: 'beauty', color: { r: 188, g: 130, b: 110 } },
      { id: 104, name: 'Deep Plum', price: '2499', image: '/src/assets/products/beauty/1.png', label: 'VELVET', category: 'beauty', color: { r: 80, g: 0, b: 50 } },
      { id: 105, name: 'Sunset Coral', price: '2499', image: '/src/assets/products/beauty/1.png', label: 'BRIGHT', category: 'beauty', color: { r: 255, g: 80, b: 60 } },
    ],
    furniture: [
      { id: 11, name: 'Modern Sofa', price: '63999', image: '/src/assets/products/furniture/product-1.jpg', label: 'NEW', category: 'furniture' },
      { id: 12, name: 'Lounge Chair', price: '31999', image: '/src/assets/products/furniture/product-2.jpg', label: 'POPULAR', category: 'furniture' },
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
        {['all', 'eyewear', 'fashion', 'jewelry', 'beauty', 'furniture'].map((cat) => (
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
