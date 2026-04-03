import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { StaggerContainer, FloatingElement, ScrollIndicator } from './AnimationComponents';
import { StatCard } from './ScrollAnimations';

const HomeHero = () => {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F5DC 0%, #FAF0E6 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 40px 80px'
    }}>
      {/* Floating decorative elements */}
      <FloatingElement duration={4}>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #A0522D 0%, #D2B48C 100%)',
          opacity: 0.1,
          filter: 'blur(40px)'
        }} />
      </FloatingElement>

      <FloatingElement duration={6}>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5C3317 0%, #A0522D 100%)',
          opacity: 0.08,
          filter: 'blur(30px)'
        }} />
      </FloatingElement>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', minHeight: '70vh' }}>
          {/* Left Content */}
          <div>
            <StaggerContainer delay={0.2}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#A0522D',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '24px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                AR Shopping Reimagined — 2026
              </div>

              <h1 style={{
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: '700',
                color: '#3E2723',
                lineHeight: '1.1',
                marginBottom: '32px',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '-1px'
              }}>
                Try Before<br/>
                You <em style={{ color: '#A0522D' }}>Buy.</em><br/>
                <span style={{
                  color: '#5C3317',
                  fontWeight: '300',
                  opacity: 0.8
                }}>In Reality.</span>
              </h1>

              <p style={{
                fontSize: '18px',
                color: '#5C3317',
                lineHeight: '1.7',
                marginBottom: '40px',
                fontFamily: "'Roboto', sans-serif",
                opacity: 0.9
              }}>
                AR-Y-TRY is the first AR-native e-commerce platform built on MERN.
                Try on goggles, shirts, frocks, shoes — or place that sofa in your living room —
                all through your camera. No downloads. No guessing.
              </p>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <a href="#cta" style={{
                  padding: '16px 32px',
                  background: '#5C3317',
                  color: '#FAF0E6',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#3E2723'}
                onMouseOut={(e) => e.currentTarget.style.background = '#5C3317'}>
                  Begin Experience
                </a>

                <a href="#story-2" style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#5C3317',
                  textDecoration: 'none',
                  border: '2px solid #5C3317',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#5C3317';
                  e.currentTarget.style.color = '#FAF0E6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#5C3317';
                }}>
                  See How It Works
                </a>
              </div>
            </StaggerContainer>
          </div>

          {/* Right Content - Lottie Animation */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              height: '400px',
              background: 'linear-gradient(135deg, #FAF0E6 0%, #F5F5DC 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(92, 51, 23, 0.1)',
              border: '2px solid rgba(92, 51, 23, 0.05)'
            }}>
              <DotLottieReact
                src="/box.lottie"
                loop
                autoplay
                style={{ width: '80%', height: '80%' }}
              />
            </div>

            {/* Floating tags */}
            <FloatingElement duration={3}>
              <div style={{
                position: 'absolute',
                top: '10%',
                right: '-20px',
                background: '#FAF0E6',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(92, 51, 23, 0.1)',
                border: '1px solid rgba(92, 51, 23, 0.05)'
              }}>
                <div style={{ fontSize: '12px', color: '#5C3317', fontWeight: '600', marginBottom: '4px' }}>Rendering</div>
                <div style={{ fontSize: '14px', color: '#3E2723', fontWeight: '700' }}>WebGL Lottie <span style={{ color: '#A0522D' }}>✓</span></div>
              </div>
            </FloatingElement>

            <FloatingElement duration={5}>
              <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '-20px',
                background: '#FAF0E6',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(92, 51, 23, 0.1)',
                border: '1px solid rgba(92, 51, 23, 0.05)'
              }}>
                <div style={{ fontSize: '12px', color: '#5C3317', fontWeight: '600', marginBottom: '4px' }}>AR Object</div>
                <div style={{ fontSize: '14px', color: '#A0522D', fontWeight: '700' }}>3D Configurator</div>
              </div>
            </FloatingElement>
          </div>
        </div>

        {/* Statistics Section */}
        <div style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          <StatCard icon="📦" value={30} label="Return Rate Reduction %" delay={0.1} />
          <StatCard icon="📈" value={25} label="Higher Conversions %" delay={0.2} />
          <StatCard icon="⚡" value={2} label="AR Initialization (seconds)" delay={0.3} />
          <StatCard icon="🏷️" value={10} label="Product Categories" delay={0.4} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
        <ScrollIndicator />
      </div>
    </section>
  );
};

export default HomeHero;
