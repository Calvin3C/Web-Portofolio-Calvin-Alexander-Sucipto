function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header reveal">
          <h2>Get In <span>Touch</span></h2>
          <p>Have a project in mind or just want to say hello? Feel free to reach out!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h4>Email</h4>
                <p>calvinsucipto711@gmail.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h4>Location</h4>
                <p>Indonesia</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <h4>Phone</h4>
                <p>+62 823-3133-9737</p>
              </div>
            </div>

            <div className="contact-social">
              <h4>Follow Me</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/calvin.sucipto.1/" target="_blank" aria-label="Facebook" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/calvinalexanders/" target="_blank" aria-label="Instagram" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://wa.me/6282331339737" target="_blank" aria-label="WhatsApp" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href="https://www.linkedin.com/in/calvin-alexander-sucipto-9449b1325/" target="_blank" aria-label="LinkedIn" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://github.com/Calvin3C" target="_blank" aria-label="GitHub" rel="noreferrer"><i className="fab fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
