import { useState, useEffect } from 'react';
import { removeAuthToken } from '../api';

function Navbar({ isAdmin, onAuthChange, onOpenLogin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    removeAuthToken();
    onAuthChange(false);
    alert('You have been logged out.');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#home" className="navbar-logo">Calvin'sPortofolio<span>.</span></a>

        <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`} id="navLinks">
          <li><a href="#home" className="active" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#projects" onClick={closeMenu}>Projects</a></li>
          <li><a href="#certificates" onClick={closeMenu}>Certificates</a></li>
        </ul>

        <div className="navbar-contact">
          <a href="#contact" className="btn btn-accent-outline" onClick={closeMenu}>Contact Me</a>
          {isAdmin ? (
            <a href="#" className="btn btn-accent-outline" style={{ marginLeft: 10, padding: '10px 24px', fontSize: '0.9rem' }} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          ) : (
            <a href="#" className="btn btn-outline" style={{ marginLeft: 10, padding: '10px 24px', fontSize: '0.9rem' }} onClick={(e) => { e.preventDefault(); onOpenLogin(); closeMenu(); }}>
              Admin Login
            </a>
          )}
        </div>

        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="navToggle" 
          aria-label="Toggle navigation"
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
