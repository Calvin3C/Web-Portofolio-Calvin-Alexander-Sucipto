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
          <p className="footer-text">&copy; {new Date().getFullYear()} <span>Calvin Alexander Sucipto</span>. All rights reserved.</p>
          <div className="footer-links">
            <a href="https://www.facebook.com/calvin.sucipto.1/" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/calvinalexanders/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/6282331339737" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="https://www.linkedin.com/in/calvin-alexander-sucipto-9449b1325/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://github.com/Calvin3C" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
