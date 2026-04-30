import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from './Products';

export default function Nav({ cart, setCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = Object.values(cart || {}).reduce((a, b) => a + b, 0);

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="nav-logo">CACAO<span>NOIR</span></a>
      <ul className="nav-links">
        <li><a href="#products">Collection</a></li>
        <li><a href="#story">Our Story</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="nav-actions">
        <button className="nav-cart-btn" onClick={() => setCartOpen(!cartOpen)}>
          Cart ({totalItems})
        </button>
        {cartOpen && (
          <div className="nav-cart-dropdown">
            <h4 style={{ fontFamily: 'Playfair Display', color: 'var(--gold-light)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '1.2rem' }}>Your Cart</h4>
            {totalItems === 0 ? (
              <p style={{ fontFamily: 'Montserrat', fontSize: '0.7rem', color: 'var(--cream-dim)' }}>Your cart is empty.</p>
            ) : (
              <>
                {Object.entries(cart).map(([id, qty]) => {
                  const product = productsData.find(p => p.id === id);
                  return (
                    <div key={id} className="nav-cart-item">
                      <span>{product.name}</span>
                      <span>&times; {qty}</span>
                    </div>
                  );
                })}
                <button
                    className="nav-buy-btn"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/order-confirmation', { state: { cart } });
                    }}
                  >Proceed to Buy</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
