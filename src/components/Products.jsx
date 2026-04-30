import { useState } from 'react';

export const productsData = [
  {
    id: '01',
    icon: '🌑',
    origin: 'Madagascar · 85% Cacao',
    name: 'Velvet Eclipse',
    desc: 'Deep forest fruits and smoky undertones with a finish that lingers like a moonlit evening. Our darkest expression — unapologetically bold.',
    price: 18,
    weight: '80g',
    featured: false
  },
  {
    id: '02',
    icon: '✦',
    origin: 'Ecuador · 72% Cacao',
    name: 'Noir Absolú',
    desc: 'The pinnacle of our craft. Sun-dried Arriba beans from Piedra de Plata, yielding notes of black cherry.A masterpiece.',
    price: 26,
    weight: '80g',
    featured: true,
    badge: 'Signature'
  },

  {
    id: '04',
    icon: '🌙',
    origin: 'Ghana · 75% Cacao',
    name: 'Crépuscule',
    desc: 'Twilight in a bar. Rich roasted notes give way to warm spice and a whisper of dried orange. Complex, familiar, entirely your own.',
    price: 20,
    weight: '80g',
    featured: false
  },


];

export default function Products({ cart, setCart }) {

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <section id="products">
      <div className="products-header">
        <p className="section-label">The Collection</p>
        <h2 className="section-heading">Crafted for the <em>Discerning</em> Palate</h2>
      </div>

      {totalItems > 0 && (
        <div className="cart-summary visible" style={{ opacity: 1, transform: 'none' }}>
          <h3>Your Selection</h3>
          {Object.entries(cart).map(([id, qty]) => {
            const product = productsData.find(p => p.id === id);
            return (
              <div key={id} className="cart-item">
                {product.name} &times; {qty}
              </div>
            );
          })}
        </div>
      )}

      <div className="products-grid">
        {productsData.map((product, index) => {
          const qty = cart[product.id] || 0;
          return (
            <div key={product.id} className={`product-card ${product.featured ? 'featured' : ''}`}>
              {product.featured && <span className="featured-badge">{product.badge}</span>}
              <span className="product-number">{product.id}</span>
              <div className="product-icon">{product.icon}</div>
              <p className="product-origin">{product.origin}</p>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.desc}</p>
              <div className="product-price">
                <small>Per Bar · {product.weight}</small>
                ${product.price}
              </div>

              {qty === 0 ? (
                <button onClick={() => addToCart(product.id)} className="product-cta btn-add-cart">
                  Add to Cart
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ) : (
                <div className="qty-selector">
                  <button onClick={() => removeFromCart(product.id)} className="qty-btn">-</button>
                  <span className="qty-value">{qty}</span>
                  <button onClick={() => addToCart(product.id)} className="qty-btn">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
