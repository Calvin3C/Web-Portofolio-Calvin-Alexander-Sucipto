function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-card reveal">
          <div className="contact-cta">
            <div className="section-eyebrow"><b>04</b> Contact</div>
            <h2>Let's build something <span className="serif">together</span></h2>
            <p>Have a project in mind or just want to say hello? Feel free to reach out!</p>
            <div className="hero-buttons">
              <a href="mailto:calvinsucipto711@gmail.com" className="btn btn-primary">
                <i className="fas fa-envelope"></i> Send an email
              </a>
              <a href="https://wa.me/6282331339737" target="_blank" rel="noreferrer" className="btn btn-outline">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>

            <div className="contact-social">
              <h4>Follow me</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/calvin.sucipto.1/" target="_blank" aria-label="Facebook" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/calvinalexanders/" target="_blank" aria-label="Instagram" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/6282331339737" target="_blank" aria-label="WhatsApp" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href="https://www.linkedin.com/in/calvin-alexander-sucipto-9449b1325/" target="_blank" aria-label="LinkedIn" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://github.com/Calvin3C" target="_blank" aria-label="GitHub" rel="noreferrer"><i className="fab fa-github"></i></a>
              </div>
            </div>
          </div>

          <div className="contact-info">
            <a href="mailto:calvinsucipto711@gmail.com" className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div>
                <h4>Email</h4>
                <p>calvinsucipto711@gmail.com</p>
              </div>
            </a>
            <a href="tel:+6282331339737" className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-phone"></i></div>
              <div>
                <h4>Phone</h4>
                <p>+62 823-3133-9737</p>
              </div>
            </a>
            <div className="contact-info-item">
              <div className="contact-icon"><i className="fas fa-location-dot"></i></div>
              <div>
                <h4>Location</h4>
                <p>Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
