import { useLocation } from 'react-router-dom';
import GameHub from '../pages/GameHub';

export default function GameRouter() {
  const location = useLocation();

  if (location.pathname === '/play/snakesladders') {
    return <GameHub />;
  }

  return null;
}
