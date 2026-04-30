import { useEffect, useRef } from 'react';

export default function Hero() {
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${s * 0.3}px)`;
          contentRef.current.style.opacity = 1 - s / (window.innerHeight * 0.7);
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translateX(-50%) translateY(${-s * 0.15}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero">
      <div className="hero-bg-rings">
        <div className="hero-ring"></div>
        <div className="hero-ring"></div>
        <div className="hero-ring"></div>
      </div>
      <div className="hero-glow" ref={glowRef}></div>
      <div className="hero-content" ref={contentRef}>
        <p className="hero-eyebrow">Est. 2024 · Single Origin Dark Chocolate</p>
        <h1 className="hero-title">CACAO<em>NOIR</em></h1>
        <div className="hero-divider"></div>
        <p className="hero-subtitle">Where darkness becomes <em style={{ color: 'var(--gold-light)' }}>extraordinary pleasure</em></p>

      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
