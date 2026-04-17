/* ============================================
   MAIN.JS — Portfolio Frontend Logic
   ============================================ */

const API_BASE = '/api';

// ──── DOM Ready ────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initCountUp();
  initContactForm();

  // Auth logic
  initLoginLogic();
  checkAuthStatus();

  initProjectModal();
  initCertificateModal();
  fetchProjects();
  fetchCertificates();
});

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    navToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });
}


// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// COUNT UP ANIMATION
// ============================================
function initCountUp() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count, 10);
        animateCount(counter, target);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current >= target) {
      element.textContent = target;
      return;
    }
    element.textContent = Math.floor(current);
    requestAnimationFrame(update);
  }

  update();
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
}

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered reveal for grid items
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ============================================
// PROJECT MODAL & ADD/EDIT/DELETE LOGIC
// ============================================
function initProjectModal() {
  const btnAdd = document.getElementById('btnAddProject');
  const modal = document.getElementById('projectModal');
  const btnClose = document.getElementById('closeProjectModal');
  const addForm = document.getElementById('addProjectForm');
  const modalTitle = modal?.querySelector('.modal-title');

  if (!btnAdd || !modal) return;

  // Open modal for NEW project
  btnAdd.addEventListener('click', () => {
    addForm.reset();
    document.getElementById('editProjectId').value = '';
    modalTitle.textContent = 'Add New Project';
    modal.classList.add('active');
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('active');
    addForm.reset();
  };

  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Form Submission
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = addForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    // Collect data
    const formData = new FormData(addForm);
    const newProject = {
      title: formData.get('title'),
      description: formData.get('description'),
      tech_stack: formData.get('tech_stack'),
      image_url: formData.get('image_url'),
      project_url: formData.get('project_url')
    };

    const editId = formData.get('id');
    const isEdit = !!editId;
    const url = isEdit ? `${API_BASE}/projects/${editId}` : `${API_BASE}/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newProject)
      });

      if (!res.ok) throw new Error('Failed to save project');

      // Success
      btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      // Refresh project list
      await fetchProjects();

      // Close modal after success
      setTimeout(() => {
        closeModal();
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);

    } catch (err) {
      console.error(err);
      btn.innerHTML = '<i class="fas fa-times"></i> Error';
      btn.style.background = '#dc2626';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    }
  });
}

// Global functions for inline Edit/Delete buttons (Projects)
window.editProject = function (btnElement) {
  // Read dataset attributes off the button element
  const project = btnElement.dataset;
  if (!project) return;

  // Populate Form
  document.getElementById('editProjectId').value = project.id || '';
  document.getElementById('projTitle').value = project.title || '';
  document.getElementById('projDesc').value = project.desc || '';
  document.getElementById('projTech').value = project.tech || '';
  document.getElementById('projImg').value = project.img || '';
  document.getElementById('projUrl').value = project.url || '';

  // Show Modal
  const modal = document.getElementById('projectModal');
  modal.querySelector('.modal-title').textContent = 'Edit Project';
  modal.classList.add('active');
};

window.deleteProject = async function (id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  const token = localStorage.getItem('admin_token');
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!res.ok) throw new Error('Failed to delete');
    await fetchProjects(); // Refresh after delete
  } catch (err) {
    console.error('Delete error', err);
    alert('Failed to delete project');
  }
};

// ============================================
// LOGIN AND AUTHENTICATION LOGIC
// ============================================
function checkAuthStatus() {
  const token = localStorage.getItem('admin_token');
  const btnAddProj = document.getElementById('btnAddProject');
  const btnAddCert = document.getElementById('btnAddCertificate');
  const btnLogin = document.getElementById('navBtnLogin');

  if (token) {
    if (btnAddProj) btnAddProj.style.display = 'inline-flex';
    if (btnAddCert) btnAddCert.style.display = 'inline-flex';
    if (btnLogin) {
      btnLogin.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      btnLogin.classList.add('btn-accent-outline');
      btnLogin.classList.remove('btn-outline');
    }
  } else {
    if (btnAddProj) btnAddProj.style.display = 'none';
    if (btnAddCert) btnAddCert.style.display = 'none';
    if (btnLogin) {
      btnLogin.innerHTML = 'Admin Login';
      btnLogin.classList.add('btn-outline');
      btnLogin.classList.remove('btn-accent-outline');
    }
  }

  // Reload grids to show/hide admin action buttons nicely
  if (window.gridsInitialized) {
    fetchProjects();
    fetchCertificates();
  } else {
    window.gridsInitialized = true;
  }
}

function initLoginLogic() {
  const btnLogin = document.getElementById('navBtnLogin');
  const loginModal = document.getElementById('loginModal');
  const btnClose = document.getElementById('closeLoginModal');
  const loginForm = document.getElementById('loginForm');

  if (!btnLogin || !loginModal) return;

  // Handle Login button click (Navbar)
  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    if (token) {
      // Initiate Logout
      localStorage.removeItem('admin_token');
      checkAuthStatus();
      alert('You have been logged out.');
    } else {
      // Open Login Modal
      loginModal.classList.add('active');
    }
  });

  // Close modal
  const closeLogin = () => {
    loginModal.classList.remove('active');
    loginForm.reset();
  };

  btnClose.addEventListener('click', closeLogin);
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLogin();
  });

  // Handle Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;

    const formData = new FormData(loginForm);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password')
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to login');

      // Success
      btn.innerHTML = '<i class="fas fa-check"></i> Success!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      // Save token
      localStorage.setItem('admin_token', data.token);
      checkAuthStatus();

      // Close modal
      setTimeout(() => {
        closeLogin();
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 1000);

    } catch (err) {
      console.error(err);
      btn.innerHTML = '<i class="fas fa-times"></i> Invalid Credentials';
      btn.style.background = '#dc2626';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    }
  });
}

// ============================================
// FETCH & RENDER PROJECTS
// ============================================
async function fetchProjects() {
  const grid = document.getElementById('projectsGrid');

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('API unavailable');
    const projects = await res.json();
    renderProjects(grid, projects);
  } catch (err) {
    console.warn('Could not fetch projects from API, using fallback data.', err);
    // Fallback — render sample data so the UI is never empty
    renderProjects(grid, getFallbackProjects());
  }
}

function renderProjects(container, projects) {
  const isAdmin = !!localStorage.getItem('admin_token');

  container.innerHTML = projects.map(project => `
    <div class="project-card reveal">
      ${isAdmin ? `
      <div class="admin-actions">
        <button class="admin-btn edit" onclick="editProject(this)" 
          data-id="${project.ID || project.id}"
          data-title="${project.Title || project.title || ''}"
          data-desc="${project.Description || project.description || ''}"
          data-tech="${project.TechStack || project.tech_stack || ''}"
          data-img="${project.ImageURL || project.image_url || ''}"
          data-url="${project.ProjectURL || project.project_url || ''}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="admin-btn delete" onclick="deleteProject(${project.ID || project.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      ` : ''}
      <div class="project-card-image-wrapper">
        <img
          src="${project.ImageURL || project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'}"
          alt="${project.Title || project.title}"
          class="project-card-image"
          loading="lazy"
        />
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${project.Title || project.title}</h3>
        <p class="project-card-desc">${project.Description || project.description}</p>
        <div class="project-card-tech">
          ${(project.TechStack || project.tech_stack || '').split(',').map(t =>
    `<span class="tech-tag">${t.trim()}</span>`
  ).join('')}
        </div>
        <a href="${project.ProjectURL || project.project_url || '#'}" target="_blank" class="project-card-link">
          View Project <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join('');

  // Re-observe newly added reveal elements
  initScrollReveal();
}

function getFallbackProjects() {
  return [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce web application with product catalog, shopping cart, and order management system built with modern technologies.',
      tech_stack: 'Go, Gin, PostgreSQL, JavaScript',
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
      project_url: '#'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management tool featuring real-time updates, drag-and-drop boards, and team workspace functionalities.',
      tech_stack: 'React, Node.js, MongoDB, Socket.io',
      image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80',
      project_url: '#'
    },
    {
      title: 'Weather Dashboard',
      description: 'An interactive weather dashboard that displays real-time weather data, forecasts, and beautiful data visualizations for any location.',
      tech_stack: 'HTML, CSS, JavaScript, REST API',
      image_url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80',
      project_url: '#'
    }
  ];
}

// ============================================
// FETCH & RENDER CERTIFICATES
// ============================================
async function fetchCertificates() {
  const grid = document.getElementById('certificatesGrid');

  try {
    const res = await fetch(`${API_BASE}/certificates`);
    if (!res.ok) throw new Error('API unavailable');
    const certs = await res.json();
    renderCertificates(grid, certs);
  } catch (err) {
    console.warn('Could not fetch certificates from API, using fallback data.', err);
    renderCertificates(grid, getFallbackCertificates());
  }
}

function renderCertificates(container, certs) {
  const isAdmin = !!localStorage.getItem('admin_token');

  container.innerHTML = certs.map(cert => `
    <div class="cert-card reveal">
      ${isAdmin ? `
      <div class="admin-actions">
        <button class="admin-btn edit" onclick="editCertificate(this)" 
          data-id="${cert.ID || cert.id}"
          data-name="${cert.Name || cert.name || ''}"
          data-issuer="${cert.Issuer || cert.issuer || ''}"
          data-date="${cert.DateEarned || cert.date_earned || ''}"
          data-img="${cert.ImageURL || cert.image_url || ''}"
          data-url="${cert.CredentialURL || cert.credential_url || ''}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="admin-btn delete" onclick="deleteCertificate(${cert.ID || cert.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      ` : ''}
      <img
        src="${cert.ImageURL || cert.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80'}"
        alt="${cert.Name || cert.name}"
        class="cert-card-image"
        loading="lazy"
      />
      <div class="cert-card-body">
        <h3 class="cert-card-name">${cert.Name || cert.name}</h3>
        <p class="cert-card-issuer"><i class="fas fa-building"></i> ${cert.Issuer || cert.issuer}</p>
        <p class="cert-card-date"><i class="fas fa-calendar-alt"></i> ${cert.DateEarned || cert.date_earned}</p>
        <a href="${cert.CredentialURL || cert.credential_url || '#'}" target="_blank" class="cert-card-link">
          View Credential <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  `).join('');

  initScrollReveal();
}

function getFallbackCertificates() {
  return [
    {
      name: 'Google IT Support Professional Certificate',
      issuer: 'Google — Coursera',
      date_earned: 'March 2026',
      image_url: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&q=80',
      credential_url: '#'
    },
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date_earned: 'January 2026',
      image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
      credential_url: '#'
    },
    {
      name: 'Meta Front-End Developer',
      issuer: 'Meta — Coursera',
      date_earned: 'December 2025',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
      credential_url: '#'
    }
  ];
}

// ============================================
// CERTIFICATE MODAL & ADD/EDIT/DELETE LOGIC
// ============================================
function initCertificateModal() {
  const btnAdd = document.getElementById('btnAddCertificate');
  const modal = document.getElementById('certModal');
  const btnClose = document.getElementById('closeCertModal');
  const addForm = document.getElementById('addCertForm');
  const modalTitle = modal?.querySelector('.modal-title');

  if (!btnAdd || !modal) return;

  // Open modal for NEW certificate
  btnAdd.addEventListener('click', () => {
    addForm.reset();
    document.getElementById('editCertId').value = '';
    modalTitle.textContent = 'Add Certificate';
    modal.classList.add('active');
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove('active');
    addForm.reset();
  };

  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Form Submission
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = addForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    // Collect data
    const formData = new FormData(addForm);
    const newCert = {
      name: formData.get('name'),
      issuer: formData.get('issuer'),
      date_earned: formData.get('date_earned'),
      image_url: formData.get('image_url'),
      credential_url: formData.get('credential_url')
    };

    const editId = formData.get('id');
    const isEdit = !!editId;
    const url = isEdit ? `${API_BASE}/certificates/${editId}` : `${API_BASE}/certificates`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newCert)
      });

      if (!res.ok) throw new Error('Failed to save certificate');

      btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      await fetchCertificates();

      setTimeout(() => {
        closeModal();
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);

    } catch (err) {
      console.error(err);
      btn.innerHTML = '<i class="fas fa-times"></i> Error';
      btn.style.background = '#dc2626';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    }
  });
}

// Global functions for inline Edit/Delete buttons (Certificates)
window.editCertificate = function (btnElement) {
  const cert = btnElement.dataset;
  if (!cert) return;

  // Populate Form
  document.getElementById('editCertId').value = cert.id || '';
  document.getElementById('certName').value = cert.name || '';
  document.getElementById('certIssuer').value = cert.issuer || '';
  document.getElementById('certDate').value = cert.date || '';
  document.getElementById('certImg').value = cert.img || '';
  document.getElementById('certUrl').value = cert.url || '';

  // Show Modal
  const modal = document.getElementById('certModal');
  modal.querySelector('.modal-title').textContent = 'Edit Certificate';
  modal.classList.add('active');
};

window.deleteCertificate = async function (id) {
  if (!confirm('Are you sure you want to delete this certificate?')) return;

  const token = localStorage.getItem('admin_token');
  try {
    const res = await fetch(`${API_BASE}/certificates/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!res.ok) throw new Error('Failed to delete');
    await fetchCertificates();
  } catch (err) {
    console.error('Delete error', err);
    alert('Failed to delete certificate');
  }
};
