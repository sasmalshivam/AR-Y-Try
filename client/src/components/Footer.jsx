import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-name">AR<span>-Y-</span>TRY</div>
            <p>Augmented Reality E-Commerce for the next generation of conscious, confident shoppers. Built with MERN and a deep belief that you deserve to see it before you buy it.</p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
              <a href="#" style={{ width: '36px', height: '36px', border: '1px solid #5C3317', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#A0522D'} onMouseOut={(e) => e.currentTarget.style.borderColor='#5C3317'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3E2723" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', border: '1px solid #5C3317', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#A0522D'} onMouseOut={(e) => e.currentTarget.style.borderColor='#5C3317'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3E2723" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', border: '1px solid #5C3317', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.borderColor='#A0522D'} onMouseOut={(e) => e.currentTarget.style.borderColor='#5C3317'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3E2723" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="#story-3">AR Try-On</a></li>
              <li><a href="#story-3">Furniture Preview</a></li>
              <li><a href="#story-4">Technology</a></li>
              <li><a href="#story-9">Roadmap</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Categories</div>
            <ul className="footer-links">
              <li><a href="#">Eyewear</a></li>
              <li><a href="#">Fashion</a></li>
              <li><a href="#">Footwear</a></li>
              <li><a href="#">Accessories</a></li>
              <li><a href="#">Furniture</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 AR-Y-TRY Technologies. All rights reserved.</div>
          <div className="footer-tech-badge">
            <span className="tech-pill">MongoDB</span>
            <span className="tech-pill">Express</span>
            <span className="tech-pill">React</span>
            <span className="tech-pill">Node.js</span>
            <span className="tech-pill">AR.js</span>
            <span className="tech-pill">TF.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
