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
      <FloatingElement duration={4}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #A0522D 0%, #D2B48C 100%)', opacity: 0.1, filter: 'blur(50px)' }} />
      </FloatingElement>
      <FloatingElement duration={6}>
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #5C3317 0%, #A0522D 100%)', opacity: 0.08, filter: 'blur(35px)' }} />
      </FloatingElement>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', minHeight: '70vh' }}>

          {/* Left Content */}
          <div>
            <StaggerContainer delay={0.2}>
              {/* Eyebrow */}
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#A0522D', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px', fontFamily: "'Roboto', sans-serif", display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '30px', height: '1.5px', background: '#A0522D' }} />
                India's Premier AR Virtual Try-On Store
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 'clamp(42px, 5vw, 66px)', fontWeight: '800', color: '#3E2723', lineHeight: '1.1', marginBottom: '28px', fontFamily: "'Playfair Display', serif", letterSpacing: '-1px' }}>
                Wear It Virtually.<br />
                <em style={{ color: '#A0522D', fontStyle: 'italic' }}>Love It Confidently.</em><br />
                <span style={{ color: '#5C3317', fontWeight: '400', fontSize: '0.7em', opacity: 0.78 }}>Buy It Instantly.</span>
              </h1>

              {/* Description */}
              <p style={{ fontSize: '17px', color: '#5C3317', lineHeight: '1.85', marginBottom: '40px', fontFamily: "'Roboto', sans-serif", opacity: 0.88, maxWidth: '460px' }}>
                AR-Y-TRY is your real-time virtual fitting room. Try on shirts, eyewear &amp; jewellery live through your camera — see exactly how it looks on <em>you</em>, before you buy. No guesswork. Zero returns.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="/try-on" style={{ padding: '16px 36px', background: '#5C3317', color: '#FAF0E6', textDecoration: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', fontFamily: "'Roboto', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.3s', display: 'inline-block' }}
                  onMouseOver={e => e.currentTarget.style.background = '#3E2723'}
                  onMouseOut={e => e.currentTarget.style.background = '#5C3317'}>
                  Try On Now →
                </a>
                <a href="/products" style={{ padding: '16px 30px', background: 'transparent', color: '#5C3317', textDecoration: 'none', border: '2px solid #A0522D', borderRadius: '6px', fontSize: '12px', fontWeight: '600', fontFamily: "'Roboto', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.3s', display: 'inline-block' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#5C3317'; e.currentTarget.style.color = '#FAF0E6'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C3317'; }}>
                  Browse Catalog
                </a>
              </div>
            </StaggerContainer>
          </div>

          {/* Right — Lottie */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', maxWidth: '500px', height: '400px', background: 'linear-gradient(135deg, #FAF0E6 0%, #F5F5DC 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(92,51,23,0.1)', border: '2px solid rgba(92,51,23,0.05)' }}>
              <DotLottieReact src="/box.lottie" loop autoplay style={{ width: '80%', height: '80%' }} />
            </div>

            <FloatingElement duration={3}>
              <div style={{ position: 'absolute', top: '10%', right: '-20px', background: '#FAF0E6', padding: '12px 18px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(92,51,23,0.12)', border: '1px solid rgba(160,82,45,0.12)' }}>
                <div style={{ fontSize: '10px', color: '#A0522D', fontWeight: '700', marginBottom: '3px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Live AR</div>
                <div style={{ fontSize: '13px', color: '#3E2723', fontWeight: '700' }}>Try-On Active <span style={{ color: '#27ae60' }}>●</span></div>
              </div>
            </FloatingElement>

            <FloatingElement duration={5}>
              <div style={{ position: 'absolute', bottom: '20%', left: '-20px', background: '#FAF0E6', padding: '12px 18px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(92,51,23,0.12)', border: '1px solid rgba(160,82,45,0.12)' }}>
                <div style={{ fontSize: '10px', color: '#A0522D', fontWeight: '700', marginBottom: '3px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Try-On Categories</div>
                <div style={{ fontSize: '13px', color: '#3E2723', fontWeight: '700' }}>Shirts · Eyewear · Jewellery</div>
              </div>
            </FloatingElement>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <StatCard icon="👗" value={150} label="Products Available to Try On" delay={0.1} />
          <StatCard icon="📈" value={25} label="Higher Purchase Confidence %" delay={0.2} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
        <ScrollIndicator />
      </div>
    </section>
  );
};

export default HomeHero;
