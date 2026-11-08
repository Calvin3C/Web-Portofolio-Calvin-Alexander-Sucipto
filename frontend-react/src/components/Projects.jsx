import { useState, useEffect } from 'react';
import { fetchProjects, deleteProject } from '../api';

function Projects({ isAdmin, onOpenAdd, onOpenEdit, refreshTrigger }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [refreshTrigger]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.warn('Failed to fetch projects from API', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => (p.id || p.ID) !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header reveal">
          <div>
            <div className="section-eyebrow"><b>02</b> Work</div>
            <h2>Selected <span>projects</span></h2>
          </div>
          <div>
            <p>A showcase of projects I've built — from web apps to creative experiments.</p>
            {isAdmin && (
              <button className="btn btn-accent-outline btn-add-header" style={{ marginTop: 16 }} onClick={onOpenAdd}>
                <i className="fas fa-plus"></i> Add Project
              </button>
            )}
          </div>
        </div>

        <div className="projects-grid">
          {loading ? (
            <>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
            </>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <p>Projects are on their way — check back soon.</p>
            </div>
          ) : projects.map(proj => (
            <div className="project-card reveal" key={proj.id || proj.ID}>
              {isAdmin && (
                <div className="admin-actions">
                  <button className="admin-btn edit" onClick={() => onOpenEdit(proj)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="admin-btn delete" onClick={() => handleDelete(proj.id || proj.ID)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
              <div className="project-card-image-wrapper">
                <img
                  src={proj.image_url || proj.ImageURL || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'}
                  alt={proj.title || proj.Title}
                  className="project-card-image"
                  loading="lazy"
                />
              </div>
              <div className="project-card-body">
                <h3 className="project-card-title">{proj.title || proj.Title}</h3>
                <p className="project-card-desc">{proj.description || proj.Description}</p>
                <div className="project-card-tech">
                  {((proj.tech_stack || proj.TechStack) || '').split(',').map((t, idx) => (
                    <span className="tech-tag" key={idx}>{t.trim()}</span>
                  ))}
                </div>
                <a href={proj.project_url || proj.ProjectURL || '#'} target="_blank" rel="noreferrer" className="project-card-link">
                  View Project <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
