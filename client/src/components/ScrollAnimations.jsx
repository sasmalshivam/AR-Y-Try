import React from 'react';
import { motion as Motion } from 'framer-motion';

// Scroll Reveal from Left
export const RevealFromLeft = ({ children, delay = 0 }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {children}
    </Motion.div>
  );
};

// Scroll Reveal from Right
export const RevealFromRight = ({ children, delay = 0 }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {children}
    </Motion.div>
  );
};

// Scroll Reveal from Bottom
export const RevealFromBottom = ({ children, delay = 0 }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {children}
    </Motion.div>
  );
};

// Counter Animation (for statistics)
const CounterValue = ({ value, duration = 2 }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = {
      from: 0,
      to: value,
    };

    const inView = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let animationFrameId;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / (duration * 1000), 1);
          const current = Math.floor(controls.from + (controls.to - controls.from) * progress);
          
          if (node) {
            node.textContent = current.toLocaleString();
          }

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
          }
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
      }
    });

    inView.observe(node);
    return () => inView.disconnect();
  }, [value, duration]);

  return <span ref={ref}>0</span>;
};

// Stat Card with Counter
export const StatCard = ({ icon, value, label, delay = 0 }) => {
  return (
    <RevealFromBottom delay={delay}>
      <Motion.div
        style={{
          padding: '24px',
          background: '#FAF0E6',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(92, 51, 23, 0.1)'
        }}
        whileHover={{
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(92, 51, 23, 0.1)',
          transition: { duration: 0.3 }
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>
          {icon}
        </div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#A0522D',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '8px'
          }}
        >
          <CounterValue value={value} duration={1.5} />
          {typeof value === 'string' ? value : '+'}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#5C3317',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          {label}
        </div>
      </Motion.div>
    </RevealFromBottom>
  );
};

// Slide In Text Animation
export const SlideInText = ({ text, direction = 'left', delay = 0 }) => {
  const initialX = direction === 'left' ? -40 : 40;

  return (
    <Motion.span
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.5 }}
    >
      {text}
    </Motion.span>
  );
};

// Pulse Animation (for highlights)
export const PulseElement = ({ children }) => {
  return (
    <Motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </Motion.div>
  );
};

export default {
  RevealFromLeft,
  RevealFromRight,
  RevealFromBottom,
  StatCard,
  SlideInText,
  PulseElement,
};
