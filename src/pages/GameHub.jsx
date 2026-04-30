import SnakesLadders from '../games/SnakesLadders/SnakesLadders';
import { Link } from 'react-router-dom';
import '../styles/GameHub.css';

export default function GameHub() {
  return (
    <div className="gh-page">
      <Link to="/" className="gh-back">← Back to Shop</Link>
      <SnakesLadders />
    </div>
  );
}
