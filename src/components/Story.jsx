import chocolateImg from '../assets/images/noir_absolu.png';
import cocoaImg from '../assets/images/bean.png';

export default function Story() {
  return (
    <section id="story">
      <div className="story-visual">
        <div className="story-img-frame">
          <img className="story-img-inner" src={chocolateImg} alt="Premium luxury dark chocolate bar" />
        </div>
        <div className="story-img-frame">
          <img className="story-img-inner" src={cocoaImg} alt="Raw cocoa beans" />
        </div>
        <div className="story-stat">
          <div className="story-stat-number">14</div>
          <div className="story-stat-label">Origins · 6 Continents</div>
        </div>
      </div>

      <div className="story-content">
        <p className="section-label">Our Story</p>
        <h2 className="section-heading">
          Darkness <em>Crafted</em><br />with Purpose
        </h2>
        <p className="story-text">
          CACAO NOIR was born from a simple obsession: <strong>chocolate that tells the truth</strong>. Not sweetened, not diluted, not compromised. Every bar begins at the source — in conversation with the farmers who tend the trees, learning the soil, the altitude, the rainfall.
        </p>
        <p className="story-text">
          We believe that the finest chocolate needs <strong>nothing to hide behind</strong>. Our process strips back every unnecessary step, letting the character of each bean speak with full clarity and unapologetic depth.
        </p>
        <div className="story-values">
          <div className="story-value">

            <div className="story-value-text">
              <h4>Direct Trade</h4>
              <p>Premium prices paid directly to farming families. No middlemen, no compromises.</p>
            </div>
          </div>
          <div className="story-value">

            <div className="story-value-text">
              <h4>Living Wages, Always</h4>
              <p>We audit every partner farm annually. Sustainability isn't a tagline here.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
