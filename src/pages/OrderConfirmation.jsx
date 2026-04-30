import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { productsData } from '../components/Products';
import '../styles/OrderConfirmation.css';

export default function OrderConfirmation({ cart, setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Use cart from props or location state as fallback
  const currentCart = cart && Object.keys(cart).length > 0 ? cart : (location.state?.cart || {});

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const VALID_COUPONS = {
    'SAMPLE': { discount: 0.00, label: 'Free Sample' },
    'NOIR10': { discount: 0.10, label: '10% OFF' },
    'NOIR05': { discount: 0.05, label: '5% OFF' },
    'NOIR20': { discount: 0.20, label: '20% OFF' },
    'CHOCFREE': { discount: 0.00, label: 'Free Box' }
  };

  useEffect(() => {
    // Load leaderboard
    try {
      const lb = JSON.parse(localStorage.getItem('cn_leaderboard') || '[]');
      setLeaderboard(lb.slice(0, 5));
    } catch { setLeaderboard([]); }
  }, []);

  const items = Object.entries(currentCart).map(([id, qty]) => ({
    product: productsData.find(p => p.id === id),
    qty,
  })).filter(i => i.product);

  const subtotal = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const discountRate = appliedCoupon ? VALID_COUPONS[appliedCoupon].discount : 0;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      alert(`Coupon ${code} applied! ${VALID_COUPONS[code].label} discount granted.`);
    } else {
      alert('Invalid coupon code. Use a reward code from our games!');
    }
  };

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true);
    if (setCart) setCart({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="oc-page">
      <div className="oc-bg" />
      <Link to="/" className="oc-back">← Back to Shop</Link>

      {/* Conditional Header */}
      <div className="oc-header">
        {isOrderPlaced ? (
          <>
            <div className="oc-check">✓</div>
            <h1 className="oc-title">Order Confirmed!</h1>
            <p className="oc-subtitle">Your dark luxury chocolate is on its way.</p>
          </>
        ) : (
          <>
            <div className="oc-icon">📦</div>
            <h1 className="oc-title">Complete Your Order</h1>
            <p className="oc-subtitle">Review your selection and unlock your rewards.</p>
          </>
        )}
      </div>

      <div className="oc-body">
        {/* Order Summary & Coupon Section */}
        {!isOrderPlaced && (
          <div className="oc-card oc-checkout-card">
            <h2 className="oc-card-title">Order Summary</h2>
            {items.length === 0 ? (
              <p className="oc-empty">No items in your cart.</p>
            ) : (
              <>
                <div className="oc-items-list">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="oc-item">
                      <span className="oc-item-icon">{product.icon}</span>
                      <span className="oc-item-name">{product.name}</span>
                      <span className="oc-item-qty">× {qty}</span>
                      <span className="oc-item-price">${(product.price * qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="oc-coupon-section">
                  <div className="oc-input-group">
                    <input
                      type="text"
                      className="oc-coupon-input"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="oc-btn-ghost" onClick={handleApplyCoupon}>Apply</button>
                  </div>
                  {appliedCoupon && (
                    <p className="oc-coupon-success">
                      ✨ {VALID_COUPONS[appliedCoupon].label} coupon applied!
                    </p>
                  )}
                </div>

                <div className="oc-totals-list">
                  <div className="oc-total-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="oc-total-row oc-discount">
                      <span>Discount ({VALID_COUPONS[appliedCoupon].label})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="oc-total-row oc-final-total">
                    <span>Final Amount</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="oc-btn-primary oc-place-order-btn" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </>
            )}
          </div>
        )}

        {/* Post-Order Reward Section */}
        {isOrderPlaced && (
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
        )}
      </div>

      {/* Leaderboard - Only show if not placing order or if we want to fill space */}
      {leaderboard.length > 0 && isOrderPlaced && (
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
