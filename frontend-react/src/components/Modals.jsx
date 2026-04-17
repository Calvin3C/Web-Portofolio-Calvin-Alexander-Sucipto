import { useState, useEffect } from 'react';
import { loginAdmin, createProject, updateProject, createCertificate, updateCertificate } from '../api';

// Helper: convert uploaded file to base64 data URL
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// Reusable Image Input with URL / Upload toggle
function ImageInput({ id, name, defaultValue }) {
  const [mode, setMode] = useState('url');
  const [urlValue, setUrlValue] = useState(defaultValue || '');
  const [preview, setPreview] = useState(defaultValue || '');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setPreview(base64);
    setUrlValue(base64);
  };

  return (
    <div>
      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setMode('url')}
          style={{
            padding: '4px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: mode === 'url' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
            color: '#fff', fontWeight: mode === 'url' ? 700 : 400
          }}
        >
          🔗 Image URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            padding: '4px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            background: mode === 'upload' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
            color: '#fff', fontWeight: mode === 'upload' ? 700 : 400
          }}
        >
          📁 Upload
        </button>
      </div>

      {/* Hidden field that always holds the final value */}
      <input type="hidden" name={name} value={urlValue} />

      {mode === 'url' ? (
        <input
          type="text"
          id={id}
          placeholder="https://..."
          value={urlValue}
          onChange={(e) => { setUrlValue(e.target.value); setPreview(e.target.value); }}
        />
      ) : (
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={handleFileChange}
          style={{ color: 'var(--text-primary)' }}
        />
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ marginTop: 8, width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }}
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
    </div>
  );
}

function Modals({
  isLoginOpen, onCloseLogin, onAuthSuccess,
  projectModalConfig, onCloseProjectModal,
  certModalConfig, onCloseCertModal,
  onSuccess
}) {

  // Login Form
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const token = await loginAdmin(e.target.username.value, e.target.password.value);
      localStorage.setItem('admin_token', token);
      onAuthSuccess();
      onCloseLogin();
      e.target.reset();
    } catch (err) {
      setLoginError(err.message || 'Invalid Credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // Project Form
  const [projectLoading, setProjectLoading] = useState(false);
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectLoading(true);

    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      tech_stack: formData.get('tech_stack'),
      image_url: formData.get('image_url'),
      project_url: formData.get('project_url')
    };

    try {
      if (projectModalConfig.project) {
        await updateProject(projectModalConfig.project.id || projectModalConfig.project.ID, data);
      } else {
        await createProject(data);
      }
      onSuccess();
      onCloseProjectModal();
      e.target.reset();
    } catch (err) {
      alert('Failed to save project');
    } finally {
      setProjectLoading(false);
    }
  };

  // Cert Form
  const [certLoading, setCertLoading] = useState(false);
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setCertLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      issuer: formData.get('issuer'),
      date_earned: formData.get('date_earned'),
      image_url: formData.get('image_url'),
      credential_url: formData.get('credential_url')
    };

    try {
      if (certModalConfig.cert) {
        await updateCertificate(certModalConfig.cert.id || certModalConfig.cert.ID, data);
      } else {
        await createCertificate(data);
      }
      onSuccess();
      onCloseCertModal();
      e.target.reset();
    } catch (err) {
      alert('Failed to save certificate');
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div className={`modal-overlay ${isLoginOpen ? 'active' : ''}`} id="loginModal" onClick={(e) => e.target.id === 'loginModal' && onCloseLogin()}>
        <div className="modal-box" style={{ maxWidth: 400 }}>
          <button className="modal-close" onClick={onCloseLogin}><i className="fas fa-times"></i></button>
          <h3 className="modal-title">Admin Login</h3>
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginUser">Username</label>
              <input type="text" id="loginUser" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="loginPass">Password</label>
              <input type="password" id="loginPass" name="password" required />
            </div>
            {loginError && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: 10 }}>{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={loginLoading}>
              {loginLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Project Modal */}
      <div className={`modal-overlay ${projectModalConfig.isOpen ? 'active' : ''}`} id="projectModal" onClick={(e) => e.target.id === 'projectModal' && onCloseProjectModal()}>
        <div className="modal-box">
          <button className="modal-close" onClick={onCloseProjectModal}><i className="fas fa-times"></i></button>
          <h3 className="modal-title">{projectModalConfig.project ? 'Edit Project' : 'Add New Project'}</h3>
          <form id="addProjectForm" onSubmit={handleProjectSubmit}>
            <div className="form-group">
              <label htmlFor="projTitle">Title</label>
              <input type="text" id="projTitle" name="title" defaultValue={projectModalConfig.project?.Title || projectModalConfig.project?.title} required />
            </div>
            <div className="form-group">
              <label htmlFor="projDesc">Description</label>
              <textarea id="projDesc" name="description" rows="3" defaultValue={projectModalConfig.project?.Description || projectModalConfig.project?.description} required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="projTech">Tech Stack (comma separated)</label>
              <input type="text" id="projTech" name="tech_stack" defaultValue={projectModalConfig.project?.TechStack || projectModalConfig.project?.tech_stack} placeholder="e.g. React, Node.js, CSS" />
            </div>
            <div className="form-group">
              <label>Image</label>
              <ImageInput id="projImg" name="image_url" defaultValue={projectModalConfig.project?.ImageURL || projectModalConfig.project?.image_url} />
            </div>
            <div className="form-group">
              <label htmlFor="projUrl">Project URL</label>
              <input type="text" id="projUrl" name="project_url" defaultValue={projectModalConfig.project?.ProjectURL || projectModalConfig.project?.project_url} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={projectLoading}>
              {projectLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Save Project'}
            </button>
          </form>
        </div>
      </div>

      {/* Certificate Modal */}
      <div className={`modal-overlay ${certModalConfig.isOpen ? 'active' : ''}`} id="certModal" onClick={(e) => e.target.id === 'certModal' && onCloseCertModal()}>
        <div className="modal-box">
          <button className="modal-close" onClick={onCloseCertModal}><i className="fas fa-times"></i></button>
          <h3 className="modal-title">{certModalConfig.cert ? 'Edit Certificate' : 'Add Certificate'}</h3>
          <form id="addCertForm" onSubmit={handleCertSubmit}>
            <div className="form-group">
              <label htmlFor="certName">Name</label>
              <input type="text" id="certName" name="name" defaultValue={certModalConfig.cert?.Name || certModalConfig.cert?.name} required />
            </div>
            <div className="form-group">
              <label htmlFor="certIssuer">Issuer</label>
              <input type="text" id="certIssuer" name="issuer" defaultValue={certModalConfig.cert?.Issuer || certModalConfig.cert?.issuer} required />
            </div>
            <div className="form-group">
              <label htmlFor="certDate">Date Earned</label>
              <input type="text" id="certDate" name="date_earned" defaultValue={certModalConfig.cert?.DateEarned || certModalConfig.cert?.date_earned} placeholder="e.g. March 2026" required />
            </div>
            <div className="form-group">
              <label>Image</label>
              <ImageInput id="certImg" name="image_url" defaultValue={certModalConfig.cert?.ImageURL || certModalConfig.cert?.image_url} />
            </div>
            <div className="form-group">
              <label htmlFor="certUrl">Credential URL</label>
              <input type="text" id="certUrl" name="credential_url" defaultValue={certModalConfig.cert?.CredentialURL || certModalConfig.cert?.credential_url} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={certLoading}>
               {certLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Save Certificate'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Modals;
