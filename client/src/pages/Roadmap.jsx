import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const roadmapSteps = [
  { week: 'Week 1–2', sprint: 'Sprint 1', title: 'Foundation & Auth', desc: 'MERN boilerplate, MongoDB schemas, JWT auth, product CRUD API', tags: ['Node.js setup', 'MongoDB schemas', 'JWT Auth', 'Product API'] },
  { week: 'Week 3', sprint: 'Sprint 2', title: 'Catalog & Cart UI', desc: 'Product listing, detail pages, cart with Redux', tags: ['React components', 'Redux cart', 'Filter system'] },
  { week: 'Week 4–5', sprint: 'Sprint 3 — KEY', title: 'Face AR Try-On', desc: 'MediaPipe face mesh — eyewear, caps, earring overlays', tags: ['MediaPipe Face', 'Glasses overlay', 'Cap overlay', 'Earring detection'], highlight: true },
  { week: 'Week 6–7', sprint: 'Sprint 4 — KEY', title: 'Body AR Try-On', desc: 'Pose estimation — shirts, pants, frocks rendered', tags: ['MediaPipe Pose', 'Shirt overlay', 'Full body frock', 'Footwear'], highlight: true },
  { week: 'Week 8', sprint: 'Sprint 5', title: 'Furniture 3D AR', desc: 'AR.js + Three.js — sofa and chair GLTF models', tags: ['AR.js surface', 'Three.js GLB', 'Pinch-to-scale'] },
  { week: 'Week 9–11', sprint: 'Sprint 6–7 — LAUNCH', title: 'Integration, QA & Deploy', desc: 'Connect AR to live DB, deploy to Vercel + Render', tags: ['Vercel Deploy', 'Render API', 'Mobile QA', 'Performance'], specialLaunch: true }
];

const Roadmap = () => {
  const scrollRef = useRef([]);

  const addToRefs = (el) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    scrollRef.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="arya-landing">
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <section id="story-9" style={{ margin: '0 auto', width: '100%' }}>
          <div className="story-9-inner">
            <div className="reveal" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div className="section-eyebrow" style={{ justifyContent: 'center' }}><span className="section-eyebrow-num">08</span> Development Roadmap</div>
              <h2 className="section-title">11 Weeks to<br/><em>Launch</em></h2>
              <span className="gold-line" style={{ margin: '30px auto 0' }}></span>
            </div>
            <div className="roadmap-timeline">
              {roadmapSteps.map((s, idx) => (
                <div className={`roadmap-item reveal reveal-delay-${(idx % 5) + 1}`} ref={addToRefs} key={idx}>
                  <div className="roadmap-week">{s.week}</div>
                  <div className="roadmap-dot-wrap"><div className="roadmap-dot" style={{ background: s.highlight ? 'rgba(132,148,255,0.3)' : (s.specialLaunch ? 'rgba(132,148,255,0.2)' : undefined), borderColor: s.specialLaunch ? 'var(--gold)' : undefined }}></div></div>
                  <div className="roadmap-content">
                    <div className="roadmap-sprint" style={{ color: s.specialLaunch ? 'var(--gold)' : undefined }}>{s.sprint}</div>
                    <div className="roadmap-title">{s.title}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,219,253,0.45)' }}>{s.desc}</div>
                    <div className="roadmap-items">
                      {s.tags.map(tag => <span className="roadmap-tag" key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Roadmap;
