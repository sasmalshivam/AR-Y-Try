import React from 'react';
import { motion } from 'framer-motion';
import AnimatedProductCard from './AnimatedProductCard';
import { FloatingElement, ScrollIndicator, StaggerContainer } from './AnimationComponents';
import { RevealFromLeft, RevealFromRight, RevealFromBottom, StatCard, PulseElement } from './ScrollAnimations';
import AnimatedProductsGallery from './AnimatedProductsGallery';

/**
 * AnimationsDemo Component
 * 
 * This component demonstrates all available animations from:
 * - AnimationComponents.jsx (Hero animations)
 * - ScrollAnimations.jsx (Scroll-triggered animations)
 * - AnimatedProductCard.jsx (Product cards)
 * - AnimatedProductsGallery.jsx (Complete gallery)
 * 
 * Use this as a reference for implementing animations in your components.
 */

export default function AnimationsDemo() {
  return (
    <div style={{ background: '#F5F5DC', minHeight: '100vh' }}>
      {/* SECTION 1: Hero with Floating Elements */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <StaggerContainer delay={0.2}>
          <motion.h1 style={{ fontSize: '48px', color: '#3E2723', margin: '0 0 16px' }}>
            Animation Showcase
          </motion.h1>
          <motion.p style={{ fontSize: '16px', color: '#5C3317', margin: '0 0 24px' }}>
            Scroll down to see all animation effects
          </motion.p>
        </StaggerContainer>

        <FloatingElement duration={4}>
          <motion.div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A0522D, #D2B48C)',
              margin: '40px auto',
              boxShadow: '0 8px 24px rgba(92, 51, 23, 0.2)'
            }}
          />
        </FloatingElement>

        <ScrollIndicator />
      </section>

      {/* SECTION 2: Reveal Animations */}
      <section style={{ padding: '80px 40px', background: '#FAF0E6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <RevealFromLeft delay={0.1}>
              <div>
                <h2 style={{ fontSize: '36px', color: '#3E2723', margin: '0 0 16px' }}>
                  Reveal From Left
                </h2>
                <p style={{ color: '#5C3317', fontSize: '16px', lineHeight: '1.6' }}>
                  This content slides in from the left when you scroll into view. Perfect for storytelling
                  sections that need visual emphasis.
                </p>
              </div>
            </RevealFromLeft>

            <RevealFromRight delay={0.2}>
              <motion.div
                style={{
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(135deg, #A0522D 0%, #5C3317 100%)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(92, 51, 23, 0.15)'
                }}
              />
            </RevealFromRight>
          </div>
        </div>
      </section>

      {/* SECTION 3: Statistics with Counter Animation */}
      <section style={{ padding: '80px 40px', background: '#F5F5DC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#3E2723', marginBottom: '60px' }}>
            Our Stats
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <StatCard icon="👥" value={50000} label="Active Users" delay={0} />
            <StatCard icon="🛍️" value={150000} label="Products Sold" delay={0.1} />
            <StatCard icon="⭐" value={98} label="Satisfication %" delay={0.2} />
          </div>
        </div>
      </section>

      {/* SECTION 4: Product Cards */}
      <section style={{ padding: '80px 40px', background: '#FAF0E6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', color: '#3E2723', marginBottom: '60px' }}>
            Animated Product Cards
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <AnimatedProductCard
              product={{
                name: 'Sample Product 1',
                price: '99.99',
                image: '/src/assets/products/eyewear/product-1.jpg',
                label: 'NEW'
              }}
              index={0}
            />
            <AnimatedProductCard
              product={{
                name: 'Sample Product 2',
                price: '149.99',
                image: '/src/assets/products/fashion/product-1.jpg',
                label: 'HOT'
              }}
              index={1}
            />
            <AnimatedProductCard
              product={{
                name: 'Sample Product 3',
                price: '199.99',
                image: '/src/assets/products/furniture/product-1.jpg',
                label: 'SALE'
              }}
              index={2}
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: Full Gallery */}
      <section style={{ background: '#F5F5DC' }}>
        <AnimatedProductsGallery />
      </section>

      {/* SECTION 6: Pulse Animation Example */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#FAF0E6' }}>
        <RevealFromBottom>
          <div>
            <h2 style={{ fontSize: '36px', color: '#3E2723', marginBottom: '32px' }}>
              Ready to Try On?
            </h2>

            <PulseElement>
              <motion.button
                style={{
                  padding: '16px 40px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: '#5C3317',
                  color: '#FAF0E6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s'
                }}
                whileHover={{
                  background: '#3E2723',
                  transform: 'scale(1.05)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start AR Experience
              </motion.button>
            </PulseElement>
          </div>
        </RevealFromBottom>
      </section>
    </div>
  );
}

/**
 * HOW TO USE THIS COMPONENT:
 * 
 * 1. Import in your pages:
 *    import AnimationsDemo from '../components/AnimationsDemo';
 * 
 * 2. Add to a route:
 *    <Route path="/animations-demo" component={AnimationsDemo} />
 * 
 * 3. Or include it in existing pages to test individual animations
 * 
 * COMPONENT REFERENCE:
 * - StaggerContainer: Animates children with stagger effect
 * - FloatingElement: Continuous floating animation
 * - ScrollIndicator: Animated scroll prompt
 * - RevealFromLeft/Right/Bottom: Scroll-triggered reveals
 * - StatCard: Animated counters
 * - AnimatedProductCard: Product showcase cards
 * - AnimatedProductsGallery: Complete filterable gallery
 * - PulseElement: Pulsing highlight effect
 */
