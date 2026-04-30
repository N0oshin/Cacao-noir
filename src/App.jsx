import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import GameHub from './pages/GameHub';

export default function App() {
  const [cart, setCart] = useState({});

  return (
    <>
      <Cursor />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation cart={cart} setCart={setCart} />} />
          <Route path="/games" element={<GameHub />} />
        </Routes>
      </div>
    </>
  );
}
