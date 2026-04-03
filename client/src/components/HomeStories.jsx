import React from 'react';
import { RevealFromLeft, RevealFromRight, RevealFromBottom, StatCard } from './ScrollAnimations';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomeStories = () => {
  return (
    <div style={{ background: '#F5F5DC', color: '#5C3317', padding: '80px 20px' }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '80px' }}>
        <RevealFromLeft delay={0.1}>
          <h2 style={{ fontSize: '36px', fontFamily: "'Poppins', sans-serif", color: '#3E2723' }}>Online Shopping is Broken</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.7, marginTop: '16px', fontFamily: "'Roboto', sans-serif" }}>
            Many returns happen because customers can’t know how a product fits or looks in their environment. AR-Y-TRY solves this by letting users try before buying.
          </p>
        </RevealFromLeft>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <RevealFromBottom delay={0.2}><StatCard icon="📦" value={40} label="Fashion returns due to mismatch" /></RevealFromBottom>
          <RevealFromBottom delay={0.3}><StatCard icon="💰" value={4200000000000} label="₹4.2T returns value" /></RevealFromBottom>
          <RevealFromBottom delay={0.4}><StatCard icon="👍" value={90} label="Confidence increase" /></RevealFromBottom>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '80px' }}>
        <RevealFromRight delay={0.1}>
          <h2 style={{ fontSize: '36px', fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>How It Works</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.7, marginTop: '16px', fontFamily: "\'Roboto\', sans-serif" }}>
            We make AR product preview easy and fast: Browse, point, try on, checkout.
          </p>
        </RevealFromRight>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <RevealFromLeft delay={0.2}>
            <div style={{ padding: '24px', background: '#FAF0E6', borderRadius: '16px', border: '1px solid rgba(92,51,23,0.1)' }}>
              <h3 style={{ fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>1. Browse & Select</h3>
              <p style={{ fontFamily: "\'Roboto\', sans-serif" }}>Choose AR-enabled products from categories: Eyewear, Fashion, Furniture, and accessories.</p>
            </div>
          </RevealFromLeft>

          <RevealFromRight delay={0.3}>
            <div style={{ padding: '24px', background: '#FAF0E6', borderRadius: '16px', border: '1px solid rgba(92,51,23,0.1)' }}>
              <h3 style={{ fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>2. Point & Try On</h3>
              <p style={{ fontFamily: "\'Roboto\', sans-serif" }}>Enable camera. Try products in real environment with live AR overlay.</p>
            </div>
          </RevealFromRight>

          <RevealFromLeft delay={0.4}>
            <div style={{ padding: '24px', background: '#FAF0E6', borderRadius: '16px', border: '1px solid rgba(92,51,23,0.1)' }}>
              <h3 style={{ fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>3. Buy with Confidence</h3>
              <p style={{ fontFamily: "\'Roboto\', sans-serif" }}>Purchase only what fits, reducing returns and increasing customer satisfaction.</p>
            </div>
          </RevealFromLeft>

          <RevealFromBottom delay={0.5}>
            <div style={{ padding: '24px', background: '#FAF0E6', borderRadius: '16px', border: '1px solid rgba(92,51,23,0.1)' }}>
              <h3 style={{ fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>4. Snapshot & Share</h3>
              <p style={{ fontFamily: "\'Roboto\', sans-serif" }}>Capture your AR view and share with friends before deciding.</p>
            </div>
          </RevealFromBottom>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontFamily: "\'Poppins\', sans-serif", color: '#3E2723' }}>Live AR Demo</h2>
          <p style={{ fontFamily: "\'Roboto\', sans-serif" }}>Watch a short AR loader animation for the quality and speed we deliver.</p>
        </div>
        <div style={{ width: '180px', height: '180px', padding: '12px', background: '#FAF0E6', borderRadius: '20px', border: '1px solid rgba(92,51,23,0.1)' }}>
          <DotLottieReact src="/DG spinner.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
        </div>
      </section>
    </div>
  );
};

export default HomeStories;
