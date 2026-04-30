import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // In a real app, you might send data to an API here
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section id="contact">
      <div className="contact-info">
        <p className="section-label">Get in Touch</p>
        <h2 className="section-heading">
          Let's Talk<br /><em>Chocolate</em>
        </h2>
        <p className="contact-tagline">Whether you're a wholesale enquiry, press, or simply a fellow obsessive — we welcome every conversation.</p>
        <div className="contact-details">
          <div className="contact-detail">
            <span className="contact-detail-icon">📍</span>
            <div className="contact-detail-text">
              <strong>Studio</strong>
              12 Rue du Cacao, Paris 75001<br />Open by appointment
            </div>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-icon">✉️</span>
            <div className="contact-detail-text">
              <strong>Email</strong>
              hello@cacaonoir.com
            </div>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-icon">📞</span>
            <div className="contact-detail-text">
              <strong>Phone</strong>
              +33 000 000 000
            </div>
          </div>
        </div>
      </div>

      <div className="contact-form">
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input 
            type="text" 
            name="name"
            className="form-input" 
            placeholder="Nooshin" 
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            name="email"
            className="form-input" 
            placeholder="you@example.com" 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea 
            name="message"
            className="form-textarea" 
            placeholder="Tell us what's on your mind…"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <button className="form-submit" onClick={handleSubmit}>Send Message →</button>
      </div>
    </section>
  );
}
