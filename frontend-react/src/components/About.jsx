const HIGHLIGHTS = [
  { icon: 'fas fa-display', title: 'Frontend', text: 'React.js, Next.js and Tailwind CSS for fast, responsive interfaces.' },
  { icon: 'fas fa-server', title: 'Backend', text: 'Go with Gin and GORM for clean, reliable APIs.' },
  { icon: 'fas fa-database', title: 'Databases', text: 'Relational design with PostgreSQL and MySQL.' },
  { icon: 'fas fa-pen-ruler', title: 'UI/UX', text: 'User-centric design principles in every screen.' },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header reveal">
          <div>
            <div className="section-eyebrow"><b>01</b> About</div>
            <h2>Get to know <span>me</span></h2>
          </div>
          <p>Who I am, what I do, and the tools I use to build things.</p>
        </div>

        <div className="about-grid">
          <div className="about-image reveal">
            <div className="about-img-wrapper">
              <img src="/assets/IMG_0952.png" alt="Calvin Alexander" className="about-photo" />
              <div className="about-img-border"></div>
            </div>
          </div>

          <div className="about-info reveal">
            <h3 className="about-subtitle">
              Full-Stack Developer based in <span className="serif">Indonesia</span>
            </h3>
            <p className="about-text">
              I am a passionate Full-Stack Developer with a primary focus on creating immersive, responsive, and visually polished frontend experiences using React.js, Next.js, and Tailwind CSS.
            </p>
            <p className="about-text">
              While my core expertise lies in frontend development, I also bring a solid foundation in backend architecture using Go (Gin, GORM) and relational database design (PostgreSQL), allowing me to understand and contribute across the entire stack with confidence.
            </p>

            <div className="about-highlights">
              {HIGHLIGHTS.map((h) => (
                <div className="highlight-card" key={h.title}>
                  <i className={h.icon}></i>
                  <h4>{h.title}</h4>
                  <p>{h.text}</p>
                </div>
              ))}
            </div>

            <div className="about-skills">
              <h4>Tech Stack</h4>
              <div className="skills-tags">
                <span className="skill-tag"><i className="fab fa-react"></i> React.js</span>
                <span className="skill-tag"><i className="fas fa-n" style={{ fontWeight: 'bold' }}></i> Next.js</span>
                <span className="skill-tag"><i className="fab fa-css3-alt"></i> Tailwind CSS</span>
                <span className="skill-tag"><i className="fab fa-golang"></i> Go</span>
                <span className="skill-tag"><i className="fas fa-database"></i> PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
