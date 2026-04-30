import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { productsData } from '../components/Products';
import '../styles/OrderConfirmation.css';

export default function OrderConfirmation({ setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || {};
  const gameUrl = `${window.location.origin}/play/snakesladders`;
  const [barcode, setBarcode] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Clear cart after order
    if (setCart) setCart({});
    // Load leaderboard
    try {
      const lb = JSON.parse(localStorage.getItem('cn_leaderboard') || '[]');
      setLeaderboard(lb.slice(0, 5));
    } catch { setLeaderboard([]); }
  }, []);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const items = Object.entries(cart).map(([id, qty]) => ({
    product: productsData.find(p => p.id === id),
    qty,
  })).filter(i => i.product);

  const handleEnterGame = () => {
    if (barcode.trim()) {
      navigate('/games');
    } else {
      alert('Please enter the barcode found on your chocolate box.');
    }
  };

  return (
    <div className="oc-page">
      {/* Ambient background */}
      <div className="oc-bg" />

      {/* Back link */}
      <Link to="/" className="oc-back">← Back to Shop</Link>

      {/* Confirmation header */}
      <div className="oc-header">
        <div className="oc-check">✓</div>
        <h1 className="oc-title">Order Confirmed!</h1>
        <p className="oc-subtitle">Your dark luxury chocolate is on its way.</p>
      </div>

      <div className="oc-body">
        {/* Order Summary */}
        <div className="oc-card oc-summary">
          <h2 className="oc-card-title">Order Summary</h2>
          {items.length === 0 ? (
            <p className="oc-empty">No items in this order.</p>
          ) : (
            <>
              {items.map(({ product, qty }) => (
                <div key={product.id} className="oc-item">
                  <span className="oc-item-icon">{product.icon}</span>
                  <span className="oc-item-name">{product.name}</span>
                  <span className="oc-item-qty">× {qty}</span>
                  <span className="oc-item-price">${(product.price * qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="oc-total">
                <span>Total</span>
                <span>
                  ${items.reduce((s, { product, qty }) => s + product.price * qty, 0).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Reward Code — Game Access */}
        <div className="oc-card oc-reward-card">
          <div className="oc-qr-badge">🎁 Your Exclusive Reward Code</div>
          <h2 className="oc-card-title">CN-{Math.random().toString(36).substring(2, 6).toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}</h2>
          <p className="oc-qr-desc">
            Congratulations! Use this secret code to unlock the Chocolate Realm. 
            Head to the <strong>Game Room</strong> in our Experience section and enter your reward to play!
          </p>
          <div className="oc-qr-actions">
            <Link to="/" className="oc-btn-primary">
              ✨ Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="oc-lb-section">
          <h2 className="oc-lb-title">🏅 Top Players This Week</h2>
          <div className="oc-lb-list">
            {leaderboard.map((entry, i) => (
              <div key={i} className="oc-lb-entry">
                <span className="oc-lb-rank">{i + 1}</span>
                <span className="oc-lb-name">{entry.name}</span>
                <span className="oc-lb-turns">{entry.turns} turns</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="oc-footer">
        <span>CACAO<em>NOIR</em></span>
        <span>— Dark Luxury Chocolate —</span>
      </footer>
    </div>
  );
}
