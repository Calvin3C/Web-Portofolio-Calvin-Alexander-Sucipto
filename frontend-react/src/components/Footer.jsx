function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href="#home" className="footer-logo">Calvin<span>.</span></a>
          <p className="footer-tagline">Building digital experiences with passion and precision.</p>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p className="footer-text">&copy; 2026 <span>Calvin Alexander Sucipto</span>. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
