import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomeHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  
  // Stats counter states
  const [returnRate, setReturnRate] = useState(0);
  const [conversions, setConversions] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate to 30
          let currObj = 0;
          const interval = setInterval(() => {
            currObj += 1;
            setReturnRate(Math.min(currObj, 30));
            setConversions(Math.min(currObj, 25));
            if (currObj >= 30) clearInterval(interval);
          }, 40);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-bg"></div>
      <div className="hero-grid" style={{ transform: `perspective(600px) rotateX(20deg) translateY(${scrollY * 0.2}px)` }}></div>
      <div className="orb orb-1" style={{ transform: `translateY(${scrollY * 0.04}px)` }}></div>
      <div className="orb orb-2" style={{ transform: `translateY(${scrollY * 0.07}px)` }}></div>
      <div className="orb orb-3" style={{ transform: `translateY(${scrollY * 0.05}px)` }}></div>

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="section-eyebrow-num">AR</span> Shopping Reimagined — 2026
          </div>
          <h1 className="hero-title">
            Try Before<br/>
            You <em>Buy.</em><br/>
            <span className="outline">In Reality.</span>
          </h1>
          <p className="hero-desc">
            ARYAĀ is the first AR-native e-commerce platform built on MERN. 
            Try on goggles, shirts, frocks, shoes — or place that sofa in your living room — 
            all through your camera. No downloads. No guessing.
          </p>
          <div className="hero-actions">
            <a href="#cta" className="btn-primary">Begin Experience</a>
            <a href="#story-2" className="btn-ghost">See How It Works</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="lottie-container">
            <DotLottieReact src="/box.lottie" loop autoplay />
          </div>
          
          {/* Float tags surrounding the player */}
          <div className="float-tag float-tag-1">
            <div className="tag-label">Rendering</div>
            <div className="tag-value">WebGL Lottie <span className="tag-gold">✓</span></div>
          </div>
          <div className="float-tag float-tag-2">
            <div className="tag-label">AR Object</div>
            <div className="tag-value tag-gold">3D Configurator</div>
          </div>
          <div className="float-tag float-tag-3">
            <div className="tag-label">Performance</div>
            <div className="tag-value">60 FPS <span className="tag-gold">★</span></div>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-num">{returnRate}%</div>
          <div className="stat-label">% Return Rate Reduction</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-num">{conversions}%</div>
          <div className="stat-label">% Higher Conversions</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-num">&lt;2s</div>
          <div className="stat-label">AR Initialization</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-num">10+</div>
          <div className="stat-label">Product Categories</div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-text">Scroll</div>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default HomeHero;
