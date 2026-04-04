import React, { useEffect, useState } from 'react';
import HomeHero from '../components/HomeHero';
import HomeStories from '../components/HomeStories';
import Footer from '../components/Footer';

const Home = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="arya-landing">
      <div id="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      
      <HomeHero />
      <HomeStories />
      <Footer />
    </div>
  );
};

export default Home;
