import React from 'react';
import AnimatedProductsGallery from '../components/AnimatedProductsGallery';
import Footer from '../components/Footer';

const ProductList = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5DC' }}>
      

      {/* Hero section for product page */}
      <section style={{ padding: '120px 40px 80px', textAlign: 'center', background: 'linear-gradient(135deg, #F5F5DC 0%, #FAF0E6 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#3E2723',
            marginBottom: '24px',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.5px'
          }}>
            Our Product Collection
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#5C3317',
            lineHeight: '1.6',
            fontFamily: "'Roboto', sans-serif"
          }}>
            Discover our curated selection of eyewear, fashion, and furniture.
            Try everything on with AR before you buy.
          </p>
        </div>
      </section>

      {/* Animated Product Gallery */}
      <AnimatedProductsGallery />

      <Footer />
    </div>
  );
};

export default ProductList;
