import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modals from './components/Modals';
import { getAuthToken } from './api';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => !!getAuthToken());

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [projectModalConfig, setProjectModalConfig] = useState({ isOpen: false, project: null });
  const [certModalConfig, setCertModalConfig] = useState({ isOpen: false, cert: null });

  // Update lists when modals close with success
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll-reveal: observe every .reveal element, including ones rendered
  // later (e.g. project/certificate cards that arrive from the API).
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el));
    };
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAuthChange = (status) => {
    setIsAdmin(status);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Navbar
        isAdmin={isAdmin}
        onAuthChange={handleAuthChange}
        onOpenLogin={() => setIsLoginOpen(true)}
      />
      <Hero />
      <About />
      <Projects
        isAdmin={isAdmin}
        onOpenAdd={() => setProjectModalConfig({ isOpen: true, project: null })}
        onOpenEdit={(project) => setProjectModalConfig({ isOpen: true, project })}
        refreshTrigger={refreshTrigger}
      />
      <Certificates
        isAdmin={isAdmin}
        onOpenAdd={() => setCertModalConfig({ isOpen: true, cert: null })}
        onOpenEdit={(cert) => setCertModalConfig({ isOpen: true, cert })}
        refreshTrigger={refreshTrigger}
      />
      <Contact />
      <Footer />

      <button className={`back-to-top ${showBackToTop ? 'visible' : ''}`} id="backToTop" aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-chevron-up"></i>
      </button>

      <Modals
        isLoginOpen={isLoginOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        onAuthSuccess={() => handleAuthChange(true)}

        projectModalConfig={projectModalConfig}
        onCloseProjectModal={() => setProjectModalConfig({ isOpen: false, project: null })}

        certModalConfig={certModalConfig}
        onCloseCertModal={() => setCertModalConfig({ isOpen: false, cert: null })}

        onSuccess={triggerRefresh}
      />
    </>
  );
}

export default App;
