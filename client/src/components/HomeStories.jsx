import React from 'react';
import { RevealFromLeft, RevealFromRight, RevealFromBottom } from './ScrollAnimations';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const steps = [
  {
    num: '01',
    title: 'Browse the Collection',
    body: 'Explore 150+ curated products across Shirts, Eyewear, Jewellery and more. Every item is AR-enabled and ready for a live try-on.',
    icon: '🛍️',
  },
  {
    num: '02',
    title: 'Select & Click Try On',
    body: 'Pick any product and hit the Virtual Try-On button. Your camera activates instantly — no app download, no waiting.',
    icon: '📷',
  },
  {
    num: '03',
    title: 'See It on You — Live',
    body: 'Our AI overlays the product on your body in real time using MediaPipe pose & face tracking. Tilt, turn, move — it follows you.',
    icon: '✨',
  },
  {
    num: '04',
    title: 'Buy with Full Confidence',
    body: 'Already saw it on yourself? Add to cart and check out. What you see in the AR mirror is exactly what you get delivered.',
    icon: '🛒',
  },
];

const categories = [
  { name: 'Shirts & Tops', desc: '8 styles — from classic to street, try before you commit to a size or colour.', icon: '👕' },
  { name: 'Eyewear', desc: '3 premium frames — see exactly how they sit on your face before ordering.', icon: '🕶️' },
  { name: 'Jewellery', desc: '4 pendants — visualise against your neckline in real time.', icon: '💎' },
  { name: 'Beauty', desc: 'Lip shades applied live to your face via AR — find your perfect match.', icon: '💄' },
];

const HomeStories = () => {
  return (
    <div style={{ background: '#F5F5DC', color: '#5C3317' }}>

      {/* ── WHY AR SHOPPING ─────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 40px 0' }}>
        <RevealFromLeft delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '1.5px', background: '#A0522D' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0522D', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>Why It Matters</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: "'Playfair Display', serif", color: '#3E2723', fontWeight: '700', marginBottom: '20px' }}>
            Shopping Blind Ends Here
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.85, fontFamily: "'Roboto', sans-serif", color: '#5C3317', maxWidth: '700px', opacity: 0.9 }}>
            Buying clothes or accessories online has always been a gamble — wrong size, wrong fit, wrong look. AR-Y-TRY eliminates the uncertainty. Our real-time augmented reality engine lets you see and experience every product on your actual body before a single rupee is spent.
          </p>
        </RevealFromLeft>

        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🎯', num: '100%', label: 'Products AR-Enabled', sub: 'Every item in our catalog supports live virtual try-on.' },
            { icon: '⚡', num: '<2s', label: 'AR Launch Time', sub: 'Camera activates and tracks your pose in under 2 seconds.' },
            { icon: '🔒', num: 'Zero', label: 'Data Stored', sub: 'Your camera feed never leaves your device. Privacy first.' },
          ].map((c, i) => (
            <RevealFromBottom key={i} delay={0.2 + i * 0.1}>
              <div style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(160,82,45,0.15)', borderRadius: '12px', transition: 'all 0.3s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 12px 30px rgba(92,51,23,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{c.icon}</div>
                <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: '#A0522D', lineHeight: 1, marginBottom: '8px' }}>{c.num}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#3E2723', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Roboto', sans-serif" }}>{c.label}</div>
                <div style={{ fontSize: '14px', color: '#5C3317', lineHeight: 1.6, fontFamily: "'Roboto', sans-serif" }}>{c.sub}</div>
              </div>
            </RevealFromBottom>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 40px 0' }}>
        <RevealFromRight delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '1.5px', background: '#A0522D' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0522D', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>The Process</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: "'Playfair Display', serif", color: '#3E2723', fontWeight: '700', marginBottom: '20px' }}>
            From Browse to Buy — in 4 Steps
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.85, fontFamily: "'Roboto', sans-serif", color: '#5C3317', maxWidth: '600px', opacity: 0.9 }}>
            The entire experience is frictionless. No installations. No size charts. Just point, try, and buy.
          </p>
        </RevealFromRight>

        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {steps.map((s, i) => (
            <RevealFromBottom key={i} delay={0.15 + i * 0.1}>
              <div style={{ padding: '36px 28px', background: '#FAF0E6', borderRadius: '12px', border: '1px solid rgba(92,51,23,0.08)', position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(92,51,23,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '42px', opacity: 0.08, fontFamily: "'Playfair Display', serif", fontWeight: '900', color: '#A0522D' }}>{s.num}</div>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", color: '#3E2723', fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: '#5C3317', fontSize: '14px', lineHeight: 1.75 }}>{s.body}</p>
              </div>
            </RevealFromBottom>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 40px 0' }}>
        <RevealFromLeft delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '1.5px', background: '#A0522D' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0522D', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>What You Can Try</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: "'Playfair Display', serif", color: '#3E2723', fontWeight: '700', marginBottom: '20px' }}>
            Every Category. Fully AR-Ready.
          </h2>
        </RevealFromLeft>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {categories.map((cat, i) => (
            <RevealFromBottom key={i} delay={0.15 + i * 0.1}>
              <div style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(160,82,45,0.12)', borderRadius: '12px', transition: 'all 0.3s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.borderColor = '#A0522D'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(160,82,45,0.12)'; }}>
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>{cat.icon}</div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", color: '#3E2723', fontSize: '17px', fontWeight: '600', marginBottom: '10px' }}>{cat.name}</h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: '#5C3317', fontSize: '14px', lineHeight: 1.7 }}>{cat.desc}</p>
              </div>
            </RevealFromBottom>
          ))}
        </div>
      </section>

      {/* ── LIVE AR DEMO ────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 40px', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <RevealFromLeft delay={0.1}>
          <div style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '30px', height: '1.5px', background: '#A0522D' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#A0522D', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>Powered By AI</span>
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontFamily: "'Playfair Display', serif", color: '#3E2723', fontWeight: '700', marginBottom: '18px' }}>
              Real-Time AR — No App Needed
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '16px', lineHeight: 1.85, color: '#5C3317', opacity: 0.9 }}>
              Our AR engine uses <strong>Google MediaPipe</strong> for body and face landmark detection, running entirely in-browser with Python-powered rendering. Clothes align to your shoulders. Glasses land on your nose bridge. Pendants sit at your neckline. All in real time.
            </p>
          </div>
        </RevealFromLeft>

        <RevealFromRight delay={0.2}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '180px', height: '180px', padding: '12px', background: '#FAF0E6', borderRadius: '20px', border: '1px solid rgba(92,51,23,0.1)', boxShadow: '0 10px 30px rgba(92,51,23,0.08)' }}>
              <DotLottieReact src="/DG spinner.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#A0522D', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>AR Engine Active</span>
          </div>
        </RevealFromRight>
      </section>

    </div>
  );
};

export default HomeStories;
