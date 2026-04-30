import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BarcodeEntry.css';

export default function BarcodeEntry({ onClose }) {
  const [barcode, setBarcode] = useState('');
  const navigate = useNavigate();

  const handleEnterGame = () => {
    const enteredCode = barcode.trim().toUpperCase();
    if (!enteredCode) {
      alert('Please enter your unique reward code.');
      return;
    }

    const validCodes = JSON.parse(localStorage.getItem('cn_valid_barcodes') || '[]');
    const entry = validCodes.find(item => item.code === enteredCode);

    if (entry) {
      if (Date.now() < entry.expiresAt) {
        navigate('/games');
      } else {
        alert('This reward code has expired. Codes are only valid for 7 days after purchase.');
      }
    } else {
      alert('Invalid code. Please use the unique code generated after your Cacao Noir purchase.');
    }
  };

  return (
    <div className="be-overlay">
      <div className="be-modal">
        <button className="be-close" onClick={onClose}>×</button>
        <div className="be-card">
          <div className="be-qr-badge">🎁 Your Exclusive Reward</div>
          <h2 className="be-card-title">Enter Barcode to Play!</h2>
          <p className="be-qr-desc">
            Your unique access code is printed on the side of your Cacao Noir box.
            Enter it below or use your camera to scan the barcode.
          </p>

          <div className="be-barcode-entry">
            <div className="be-input-group">
              <input
                type="text"
                className="be-barcode-input"
                placeholder="Enter Barcode ID"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                autoFocus
              />
              <div className="be-input-glow" />
            </div>

            <div className="be-qr-actions">
              <button onClick={handleEnterGame} className="be-btn-primary">
                🎮 Enter Game Hub
              </button>
              <button
                className="be-btn-ghost"
                onClick={() => alert('Camera access requested... (Simulation)')}
              >
                📷 Scan Barcode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
