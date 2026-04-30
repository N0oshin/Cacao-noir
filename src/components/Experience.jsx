import { useState } from 'react';
import BarcodeEntry from './BarcodeEntry';

export default function Experience() {
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  return (
    <section id="experience">
      {showBarcodeModal && <BarcodeEntry onClose={() => setShowBarcodeModal(false)} />}
      <div className="experience-header">
        <p className="section-label">Beyond the Bar</p>
        <h2 className="section-heading">The CACAO NOIR <em>Experience</em></h2>
        <p className="experience-tagline">
          Every purchase unlocks a world of play. Scan your exclusive bar code and enter a private realm of classic games, reimagined with dark luxury.
        </p>
      </div>

      <div className="experience-grid" style={{ display: 'flex', justifyContent: 'center', background: 'none' }}>
        <div className="exp-tile" style={{ maxWidth: '400px', width: '100%', border: '1px solid rgba(200,150,62,0.1)' }}>
          <span className="exp-tile-icon">🎲</span>
          <h3 className="exp-tile-title">Serpents & Ladders</h3>
          <p className="exp-tile-desc">The childhood classic, reimagined with Cacao Noir's dark aesthetic. Fate is fickle — but so is the best chocolate.</p>
        </div>
      </div>

      <div className="experience-cta-wrapper">
        <p className="experience-tagline">Every Cacao Noir purchase contains a unique code — your key to the experience and get rewards.</p>
        <button className="btn-experience" onClick={() => setShowBarcodeModal(true)}>
          <span className="game-tile-icon">🎮</span>
          <span>Enter the Game Room</span>
        </button>
      </div>
    </section>
  );
}
