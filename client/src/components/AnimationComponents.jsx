import React from 'react';
import { motion as Motion } from 'framer-motion';

const AnimatedHeroText = ({ children, delay = 0, duration = 0.8 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        delayChildren: delay,
        staggerChildren: 0.05,
        duration
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <Motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <Motion.div key={index} variants={itemVariants}>
          {child}
        </Motion.div>
      ))}
    </Motion.div>
  );
};

// Hero Enter Animation Container
export const HeroEnter = ({ children }) => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </Motion.div>
  );
};

// Floating Animation (for decorative elements)
export const FloatingElement = ({ children, duration = 3 }) => {
  return (
    <Motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </Motion.div>
  );
};

// Scroll Indicator Animation
export const ScrollIndicator = () => {
  return (
    <Motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: '#5C3317',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <span>Scroll to explore</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </Motion.div>
  );
};

// Staggered List Animation
export const StaggerContainer = ({ children, delay = 0 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        delayChildren: delay + 0.1,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      {React.Children.map(children, (child, index) => (
        <Motion.div key={index} variants={itemVariants}>
          {child}
        </Motion.div>
      ))}
    </Motion.div>
  );
};

export default AnimatedHeroText;
