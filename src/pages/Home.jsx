import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Products from '../components/Products';
import Story from '../components/Story';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home({ cart, setCart }) {
  return (
    <>
      <Nav cart={cart} setCart={setCart} />
      <Hero />
      <Marquee />
      <Products cart={cart} setCart={setCart} />
      <Story />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}
