function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      <div className="hero-glow-3"></div>

      <div className="container">
        {/* Left: Content */}
        <div className="hero-content">
          <p className="hero-greeting">
            <span className="greeting-wave">👋</span> Hello everyone
          </p>
          <h1 className="hero-name">I am <span>Calvin Alexander Sucipto</span></h1>
          <p className="hero-title">Full-Stack Developer</p>
          <div className="hero-divider"></div>
          <p className="hero-bio" style={{ textAlign: 'justify' }}>
            I am a Fullstack Developer with a primary focus on crafting immersive and responsive frontend
            experiences using React, Next.js, and Tailwind CSS to build high-performance, SEO-friendly,
            and visually polished web applications. While my recent work centers on building intuitive user
            interfaces, I bring a strong technical foundation in backend architecture using Go (Gin, GORM) and
            relational database design (MySQL, PostgreSQL), a dual perspective that allows me to bridge the gap
            between design and data while ensuring seamless integration and optimal performance across the entire stack.
          </p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">
              <i className="fas fa-user"></i> About me
            </a>
          </div>

          {/* Social Bar */}
          <div className="social-bar">
            <span>Find Me On</span>
            <div className="social-icons">
              <a href="https://www.facebook.com/calvin.sucipto.1/" target="_blank" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/calvinalexanders/" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/6282331339737" target="_blank" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              <a href="https://www.linkedin.com/in/calvin-alexander-sucipto-9449b1325/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://github.com/Calvin3C" target="_blank" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hero-visual">
          <div className="profile-wrapper">
            <div className="profile-blob"></div>
            <img src="/assets/IMG_0952.png" alt="Calvin Alexander Sucipto" className="profile-img" />
            <div className="deco-plus">+</div>
            <div className="deco-circle"></div>
            <div className="deco-dot"></div>
            <div className="deco-ring"></div>
            <div className="deco-square"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
