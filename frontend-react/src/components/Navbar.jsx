import { useState, useEffect } from 'react';
import { removeAuthToken } from '../api';

const SECTIONS = ['home', 'about', 'projects', 'certificates', 'contact'];

function Navbar({ isAdmin, onAuthChange, onOpenLogin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the nav link for the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    removeAuthToken();
    onAuthChange(false);
    alert('You have been logged out.');
  };

  const closeMenu = () => setIsMenuOpen(false);
  const linkClass = (id) => (activeSection === id ? 'active' : '');

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#home" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark" aria-hidden="true">C</span>
          Calvin's Portofolio<span>.</span>
        </a>

        <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`} id="navLinks">
          <li><a href="#home" className={linkClass('home')} onClick={closeMenu}>Home</a></li>
          <li><a href="#about" className={linkClass('about')} onClick={closeMenu}>About</a></li>
          <li><a href="#projects" className={linkClass('projects')} onClick={closeMenu}>Projects</a></li>
          <li><a href="#certificates" className={linkClass('certificates')} onClick={closeMenu}>Certificates</a></li>
          <li className="mobile-only"><a href="#contact" className={linkClass('contact')} onClick={closeMenu}>Contact</a></li>
        </ul>

        <div className="navbar-contact">
          {isAdmin ? (
            <a href="#" className="btn btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          ) : (
            <a href="#" className="btn btn-outline" onClick={(e) => { e.preventDefault(); onOpenLogin(); closeMenu(); }}>
              Admin
            </a>
          )}
          <a href="#contact" className="btn btn-primary" onClick={closeMenu}>Contact me</a>
        </div>

        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          id="navToggle"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
