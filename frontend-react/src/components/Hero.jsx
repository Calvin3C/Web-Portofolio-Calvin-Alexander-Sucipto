function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      <div className="hero-glow-3"></div>

      <div className="container">
        {/* Left: Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span> Full-Stack Developer · Based in Indonesia
          </div>
          <p className="hero-greeting">
            <span className="greeting-wave">👋</span> Hello everyone, I am
          </p>
          <h1 className="hero-name">
            Calvin Alexander <span className="serif">Sucipto</span>
          </h1>
          <p className="hero-title">
            Full-Stack Developer
            <span className="sep"></span>
            <span className="muted">Frontend-focused</span>
          </p>
          <p className="hero-bio">
            I am a Fullstack Developer with a primary focus on crafting immersive and responsive frontend
            experiences using React, Next.js, and Tailwind CSS to build high-performance, SEO-friendly,
            and visually polished web applications. Grounded in user-centric UI/UX design principles, I combine
            an eye for intuitive interfaces with a strong technical foundation in backend architecture using Go
            (Gin, GORM) and relational database design (MySQL, PostgreSQL)—a dual perspective that allows me to
            bridge the gap between design and data while ensuring seamless integration and optimal performance
            across the entire stack.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View my work <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#about" className="btn btn-outline">
              About me
            </a>
          </div>

          {/* Social Bar */}
          <div className="social-bar">
            <span>Find me on</span>
            <div className="social-icons">
              <a href="https://www.facebook.com/calvin.sucipto.1/" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/calvinalexanders/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/6282331339737" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              <a href="https://www.linkedin.com/in/calvin-alexander-sucipto-9449b1325/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://github.com/Calvin3C" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hero-visual">
          <div className="profile-wrapper">
            <div className="profile-frame">
              <img src="/assets/IMG_0952.png" alt="Calvin Alexander Sucipto" className="profile-img" />
            </div>
            <div className="profile-caption">
              <div>
                <strong>Calvin Alexander</strong>
                <span><i className="fas fa-location-dot"></i>Indonesia</span>
              </div>
            </div>
            <div className="floating-chip chip-1">
              <i className="fab fa-react"></i> React · Next.js
            </div>
            <div className="floating-chip chip-2">
              <i className="fab fa-golang"></i> Go · PostgreSQL
            </div>
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll to About"></a>
    </section>
  );
}

export default Hero;
