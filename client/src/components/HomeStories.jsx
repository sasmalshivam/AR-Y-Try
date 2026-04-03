import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Data for repetitive layouts
const categories = [
  { id: 'eyewear', name: 'Eyewear', count: 'SUNGLASSES · GOGGLES · FRAMES', svgPath: 'M2 12h0M10 12h4M22 12h0', circle1: '6', circle2: '18', extra: 'M6 8v0a4 4 0 000 0' },
  { id: 'tops', name: 'Tops & Shirts', count: 'SHIRTS · T-SHIRTS · KURTAS', svgPath: 'M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.86H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.86l.58-3.57a2 2 0 00-1.34-2.23z' },
  { id: 'bottoms', name: 'Pants & Bottoms', count: 'PANTS · JEANS · TROUSERS', svgPath: 'M6 2h12l1 7-7 3-7-3 1-7zM6 9v11M18 9v11M9 20h6' },
  { id: 'dresses', name: 'Dresses & Frocks', count: 'FROCKS · KURTIS · GOWNS', svgPath: 'M12 2C9 2 7 4 7 6v2L4 22h16L17 8V6c0-2-2-4-5-4zM7 8c1.5 1 3 1.5 5 1.5S15.5 9 17 8' },
  { id: 'footwear', name: 'Footwear', count: 'SHOES · SNEAKERS · SANDALS', svgPath: 'M3 14h3l2-9 4 9h9v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM12 5c0 0 1-2 3-2s4 1 4 3' },
  { id: 'headwear', name: 'Caps & Headwear', count: 'CAPS · HATS · BEANIES', svgPath: 'M12 4C8 4 5 7 5 11v2h14v-2c0-4-3-7-7-7zM5 13h14v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z' },
  { id: 'earrings', name: 'Earrings', count: 'STUDS · HOOPS · DROPS', svgPath: 'M9 7v4l-2 6h4l-2-6V7M15 7v4l-2 6h4l-2-6V7M7 17c0 2 1 4 2 4s2-2 2-4M13 17c0 2 1 4 2 4s2-2 2-4' }
];

const testimonials = [
  { star: '★★★★★', text: "I tried on 12 pairs of sunglasses in under 2 minutes. Found the perfect one. Usually this would take me three store visits.", author: "Priya Sharma", avatar: "P", loc: "Mumbai, Maharashtra" },
  { star: '★★★★★', text: "Placed a 3-seater sofa virtually in my drawing room and showed my wife. We ordered within 10 minutes. Zero uncertainty.", author: "Rahul Mishra", avatar: "R", loc: "Bhubaneswar, Odisha" },
  { star: '★★★★☆', text: "The frock try-on is uncannily accurate. I tried my wedding outfit virtually before placing the order. This is the future of fashion.", author: "Ananya Reddy", avatar: "A", loc: "Hyderabad, Telangana" },
  { star: '★★★★★', text: "No more buying three sizes and returning two. The shirt overlay is so realistic I could see how the collar fits my neck.", author: "Vikram Patel", avatar: "V", loc: "Ahmedabad, Gujarat" },
  { star: '★★★★★', text: "My daughter tried earrings virtually for her graduation. She picked in seconds. Saved us a full day at the market.", author: "Sunita Nair", avatar: "S", loc: "Kochi, Kerala" },
];



const HomeStories = () => {
  const scrollRef = useRef([]);
  const barRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [barHeights, setBarHeights] = useState([0, 0, 0, 0, 0]);

  // Hook elements to Intersection Observer
  const addToRefs = (el) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setParallaxY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    scrollRef.current.forEach((el) => observer.observe(el));

    // Observe Bars separately
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setBarHeights([50, 100, 75, 85, 45]);
        barObserver.disconnect();
      }
    }, { threshold: 0.3 });

    if (barRef.current) barObserver.observe(barRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      barObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* STORY 1: THE PROBLEM */}
      <section id="story-1" className="story-section">
        <div className="geo-pattern"></div>
        <div className="story-1-inner">
          <div className="reveal-left" ref={addToRefs}>
            <div className="section-eyebrow"><span className="section-eyebrow-num">01</span> The Problem</div>
            <h2 className="section-title">Online Shopping<br/>is <em>Broken</em></h2>
            <span className="gold-line-left"></span>
            <p className="section-body">
              Every year, e-commerce platforms lose billions to returns. The core issue is devastatingly simple:
              customers cannot see how a product will look on them or in their space before buying.
            </p>
            <p className="section-body">
              The fashion industry alone sees return rates of up to 40% for online purchases — 
              most caused by "didn't look as expected." ARYAĀ exists to end that uncertainty forever.
            </p>
            <div className="problem-stats">
              <div className="problem-card">
                <div className="problem-card-num">40%</div>
                <div className="problem-card-label">of fashion returns are due to fit and appearance not matching expectations</div>
              </div>
              <div className="problem-card">
                <div className="problem-card-num">₹4.2T</div>
                <div className="problem-card-label">global e-commerce return value lost annually</div>
              </div>
            </div>
          </div>

          <div className="return-visual reveal-right" ref={addToRefs}>
            <div className="return-visual-inner">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: 'rgba(255,219,253,0.6)', marginBottom: '8px' }}>Return Rates by Category</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,219,253,0.3)', marginBottom: '32px' }}>WITHOUT AR TRY-ON</div>
              <div className="return-bars" ref={barRef}>
                <div className="return-bar" style={{ height: `${barHeights[0]}%` }}><span className="bar-val">12%</span><span className="bar-label">Electronics</span></div>
                <div className="return-bar gold" style={{ height: `${barHeights[1]}%` }}><span className="bar-val" style={{color: 'var(--gold)'}}>40%</span><span className="bar-label">Fashion</span></div>
                <div className="return-bar" style={{ height: `${barHeights[2]}%` }}><span className="bar-val">28%</span><span className="bar-label">Footwear</span></div>
                <div className="return-bar gold" style={{ height: `${barHeights[3]}%` }}><span className="bar-val" style={{color: 'var(--gold)'}}>32%</span><span className="bar-label">Furniture</span></div>
                <div className="return-bar" style={{ height: `${barHeights[4]}%` }}><span className="bar-val">18%</span><span className="bar-label">Accessories</span></div>
              </div>
              <div className="return-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(255,255,255,0.2)' }}></div> Standard</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--gold)' }}></div> AR-Solvable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 2: HOW IT WORKS */}
      <section id="story-2">
        <div className="story-2-inner">
          <div className="story-2-header reveal" ref={addToRefs}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}><span className="section-eyebrow-num">02</span> How It Works</div>
            <h2 className="section-title">Three Steps to<br/><em>Certainty</em></h2>
            <span className="gold-line"></span>
          </div>
          <div className="steps-container">
            <div className="steps-line"></div>
            
            <div className="step-item reveal" ref={addToRefs}>
              <div className="step-content-left">
                <div className="step-num">01</div>
                <h3 className="step-title">Browse & Select</h3>
                <p className="step-desc">Explore our curated catalog of AR-enabled products. Every item tagged with the AR badge can be tried on in real-time.</p>
              </div>
              <div className="step-center">
                <div className="step-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.8)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" />
                  </svg>
                </div>
              </div>
              <div className="step-content-right">
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', color: 'var(--gold)', marginBottom: '12px' }}>AVAILABLE CATEGORIES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', color: 'rgba(255,219,253,0.5)' }}>Eyewear</span>
                    <span style={{ fontSize: '12px', border: '1px solid var(--gold)', padding: '4px 10px', color: 'var(--gold)' }}>Frocks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Repeat step logic similar to HTML */}
            <div className="step-item reveal" ref={addToRefs}>
               <div className="step-content-left">
                 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                     <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gold)', animation: 'dotBlink 1.5s infinite' }}></div>
                     <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', color: 'var(--gold)' }}>MEDIAPIPE ACTIVE</div>
                   </div>
                   <div style={{ fontSize: '13px', color: 'rgba(255,219,253,0.5)', lineHeight: '1.7' }}>
                     468 face landmarks detected<br/>
                     30fps real-time rendering<br/>
                   </div>
                 </div>
               </div>
               <div className="step-center">
                 <div className="step-icon-wrap" style={{ width: '120px', height: '120px', transform: 'none', border: 'none', background: 'transparent' }}>
                   <DotLottieReact src="/DG spinner.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
                 </div>
               </div>
               <div className="step-content-right">
                 <div className="step-num">02</div>
                 <h3 className="step-title">Activate AR Camera</h3>
                 <p className="step-desc">Tap "Try On". Grant camera access once. Our AI engine detect your face and body in real-time and overlays the product instantly.</p>
               </div>
            </div>

            <div className="step-item reveal" ref={addToRefs}>
              <div className="step-content-left">
                <div className="step-num">03</div>
                <h3 className="step-title">Review & Purchase</h3>
                <p className="step-desc">Rotate, zoom, and take snapshots of your look. Once you are 100% certain it's the right fit, checkout with absolute confidence.</p>
              </div>
              <div className="step-center">
                <div className="step-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.8)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
              </div>
              <div className="step-content-right">
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px' }}>
                   <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,219,253,0.5)', marginBottom: '12px', textTransform: 'uppercase' }}>Confidence Metrics</div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'rgba(255,219,253,0.7)' }}>Size Fit Accuracy</span>
                        <span style={{ color: 'var(--gold)' }}>98.5%</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'rgba(255,219,253,0.7)' }}>Color Fidelity</span>
                        <span style={{ color: 'var(--gold)' }}>Perfect Match</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STORY 3: CATEGORIES */}
      <section id="story-3">
        <div className="story-3-inner">
          <div className="story-3-header reveal" ref={addToRefs}>
            <div className="section-eyebrow"><span className="section-eyebrow-num">03</span> What You Can Try</div>
            <h2 className="section-title">Every Product.<br/><em>On You.</em> In Your Space.</h2>
            <span className="gold-line-left"></span>
          </div>

          <div className="category-grid reveal" ref={addToRefs}>
            {categories.map((cat) => (
              <div className="cat-card" key={cat.id}>
                <div className={`cat-bg cat-bg-${cat.id}`}></div>
                <div className="cat-overlay"></div>
                <div className="cat-icon-area">
                  <div className="cat-icon-circle">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.8)" strokeWidth="1.2" strokeLinecap="round">
                      <path d={cat.svgPath} />
                      {cat.extra && <path d={cat.extra} />}
                      {cat.circle1 && <circle cx={cat.circle1} cy={12} r={4} />}
                      {cat.circle2 && <circle cx={cat.circle2} cy={12} r={4} />}
                    </svg>
                  </div>
                </div>
                <div className="cat-tag">AR READY</div>
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{cat.count}</div>
                </div>
              </div>
            ))}
            {/* Wide furniture card */}
            <div className="cat-card wide">
              <div className="cat-bg cat-bg-sofa" style={{ background: 'linear-gradient(135deg,#100a1a,#1e1030 50%,#0a101a)' }}></div>
              <div className="cat-overlay" style={{ background: 'linear-gradient(to top,rgba(7,7,20,0.95) 0%,rgba(7,7,20,0.3) 100%)' }}></div>
              <div className="cat-icon-area" style={{ left: '30%' }}>
                <div className="cat-icon-circle" style={{ width: '100px', height: '100px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.8)" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M3 11V8a2 2 0 012-2h14a2 2 0 012 2v3" /><path d="M2 11h20v4H2z" /><path d="M5 19v-4M19 19v-4" />
                  </svg>
                </div>
              </div>
              <div className="cat-tag">3D ROOM AR</div>
              <div className="cat-info">
                <div className="cat-name" style={{ fontSize: '32px' }}>Furniture</div>
                <div className="cat-count">SOFAS · CHAIRS · SECTIONALS — Place in your room</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 4: TECH */}
      <section id="story-4">
        <div className="story-4-inner">
          <div className="tech-split">
            <div className="reveal-left" ref={addToRefs}>
              <div className="section-eyebrow"><span className="section-eyebrow-num">04</span> The Technology</div>
              <h2 className="section-title">Powered by<br/><em>Real AI,</em><br/>Not Magic</h2>
              <span className="gold-line-left"></span>
              <p className="section-body">
                ARYAĀ runs the entire AR pipeline in your browser. No server round-trips for AR processing.
                TensorFlow.js and MediaPipe work at 30fps — detecting your face and body on-device.
              </p>
              <div className="tech-stack-list">
                <div className="tech-stack-item">
                  <div><div className="tech-badge">React.js</div></div>
                  <div>
                    <div className="tech-stack-name">Frontend Framework</div>
                    <div className="tech-stack-desc">Vite-powered SPA with Redux Toolkit</div>
                  </div>
                </div>
                <div className="tech-stack-item">
                  <div><div className="tech-badge">MediaPipe</div></div>
                  <div>
                    <div className="tech-stack-name">Tracking</div>
                    <div className="tech-stack-desc">468 face mesh + body keypoints</div>
                  </div>
                </div>
                <div className="tech-stack-item">
                  <div><div className="tech-badge">AR.js</div></div>
                  <div>
                    <div className="tech-stack-name">Room Detection</div>
                    <div className="tech-stack-desc">Surface plane detection</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-right" ref={addToRefs}>
              <div className="tech-diagram">
                <div className="tech-ring-outer"></div>
                <div className="tech-ring-outer-2"></div>
                <svg style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 400 400">
                  <line x1="200" y1="90" x2="200" y2="180" stroke="rgba(132,148,255,0.2)" strokeWidth="1"/>
                  <line x1="310" y1="200" x2="230" y2="200" stroke="rgba(132,148,255,0.2)" strokeWidth="1"/>
                  <line x1="200" y1="310" x2="200" y2="230" stroke="rgba(132,148,255,0.2)" strokeWidth="1"/>
                  <line x1="90" y1="200" x2="170" y2="200" stroke="rgba(132,148,255,0.2)" strokeWidth="1"/>
                </svg>
                <div className="tech-center-circle">
                  <div className="tech-center-label">ARYAĀ</div>
                  <div className="tech-center-sub">AR ENGINE</div>
                </div>
                <div className="tech-node">
                  <div className="tech-node-item" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}><div className="tech-node-item-label">React<br/>Frontend</div></div>
                  <div className="tech-node-item" style={{ top: '50%', right: '-10px', transform: 'translateY(-50%)' }}><div className="tech-node-item-label">TF.js<br/>AI</div></div>
                  <div className="tech-node-item" style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)' }}><div className="tech-node-item-label">MongoDB<br/>Atlas</div></div>
                  <div className="tech-node-item" style={{ top: '50%', left: '-10px', transform: 'translateY(-50%)' }}><div className="tech-node-item-label">Three.js<br/>Render</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 4.5: SPEED */}
      <section id="story-4-5" style={{ background: 'var(--ink)', padding: '80px 60px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="reveal" ref={addToRefs} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '60px', flex: 1 }}>
              <div className="section-eyebrow"><span className="section-eyebrow-num">04.5</span> Unmatched Speed</div>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: '16px' }}>Zero Latency,<br/><em>High-Speed</em> Data Delivery</h2>
              <p className="section-body" style={{ marginBottom: 0 }}>
                Our Node.js edge architecture coupled with MediaPipe WASM ensures that complex Augmented Reality models render at a blistering rapid pace—faster than a bullet train. Say goodbye to loading bars.
              </p>
            </div>
            <div style={{ flex: 1, height: '400px', background: 'var(--deep)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.2)' }}>
                 <DotLottieReact src="/highspeed_Train.lottie" loop autoplay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--deep) 0%, transparent 20%, transparent 80%, var(--deep) 100%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* STORY 5: JOURNEY */}
      <section id="story-5">
        <div className="story-5-inner">
          <div className="reveal" ref={addToRefs} style={{ textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}><span className="section-eyebrow-num">05</span> User Journey</div>
            <h2 className="section-title">From Curiosity<br/>to <em>Confidence</em></h2>
            <span className="gold-line"></span>
          </div>

          <div className="ux-flow">
            {[ 
              { num: 1, title: 'Discover', desc: 'Browse AR-enabled products' },
              { num: 2, title: 'Activate AR', desc: 'Camera opens, AI detects face' },
              { num: 3, title: 'Try & Explore', desc: 'See product in real-time' },
              { num: 4, title: 'Share Preview', desc: 'Share look with friends' },
              { num: 5, title: 'Buy Confidence', desc: 'Add to cart' }
            ].map((step, idx) => (
              <div className={`ux-step reveal reveal-delay-${idx+1}`} ref={addToRefs} key={step.num}>
                <div className="ux-step-circle"><div className="ux-step-num">{step.num}</div></div>
                <div className="ux-step-title">{step.title}</div>
                <p className="ux-step-body">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY 6: TESTIMONIALS */}
      <section id="story-6">
        <div className="story-6-inner">
          <div className="reveal" ref={addToRefs} style={{ textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}><span className="section-eyebrow-num">06</span> Early Testers</div>
            <h2 className="section-title">What People<br/>Are <em>Saying</em></h2>
            <span className="gold-line"></span>
          </div>
          <div className="testimonial-marquee-wrap">
            <div className="testimonial-marquee">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div className="testimonial-card" key={idx}>
                  <div className="testimonial-stars" style={{ color: 'var(--gold)' }}>{t.star}</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.avatar}</div>
                    <div><div className="author-name">{t.author}</div><div className="author-loc">{t.loc}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORY 7: PARALLAX QUOTE */}
      <section id="story-7">
        <div className="parallax-bg" style={{ transform: `translateY(${parallaxY * 0.03}px)` }}></div>
        <div className="parallax-lines"></div>
        <div className="parallax-quote reveal" ref={addToRefs}>
          <blockquote>"The future of commerce is not just seeing a product — it's <em>living with it</em> before you own it."</blockquote>
          <cite>— The ARYAĀ Vision</cite>
        </div>
      </section>



      {/* STORY CTA */}
      <section id="cta">
        <div className="cta-bg"></div>
        <div className="cta-grid"></div>
        <div className="cta-deco-num">AR</div>
        <div className="cta-content reveal" ref={addToRefs}>
          <span className="cta-tag">Early Access Now Open</span>
          <h2 className="cta-title">Stop Guessing.<br/>Start <em>Seeing.</em></h2>
          <p className="cta-subtitle">Be among the first to experience ARYAĀ — the AR shopping platform that ends returns and begins certainty.</p>
          <div className="cta-actions">
            <a href="#" className="btn-primary">Request Early Access</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeStories;
