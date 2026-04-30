import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.mx + 'px';
        cursorRef.current.style.top = pos.current.my + 'px';
      }
    };

    let animationFrameId;
    const animateRing = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px';
        ringRef.current.style.top = pos.current.ry + 'px';
      }
      animationFrameId = requestAnimationFrame(animateRing);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .product-card, .exp-tile')) {
        cursorRef.current?.classList.add('expanded');
        ringRef.current?.classList.add('expanded');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .product-card, .exp-tile')) {
        cursorRef.current?.classList.remove('expanded');
        ringRef.current?.classList.remove('expanded');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    animationFrameId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}
