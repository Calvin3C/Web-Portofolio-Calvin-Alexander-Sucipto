import { useState, useEffect } from 'react';
import { fetchCertificates, deleteCertificate } from '../api';

function Certificates({ isAdmin, onOpenAdd, onOpenEdit, refreshTrigger }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCerts();
  }, [refreshTrigger]);

  const loadCerts = async () => {
    try {
      setLoading(true);
      const data = await fetchCertificates();
      setCerts(data);
    } catch (err) {
      console.warn('Failed to fetch certificates from API', err);
      setCerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await deleteCertificate(id);
      setCerts(prev => prev.filter(c => (c.id || c.ID) !== id));
    } catch (err) {
      alert('Failed to delete certificate');
    }
  };

  return (
    <section className="certificates" id="certificates">
      <div className="container">
        <div className="section-header reveal">
          <div>
            <div className="section-eyebrow"><b>03</b> Credentials</div>
            <h2>Certificates &amp; <span>learning</span></h2>
          </div>
          <div>
            <p>Credentials and certifications I've earned throughout my learning journey.</p>
            {isAdmin && (
              <button className="btn btn-accent-outline btn-add-header" style={{ marginTop: 16 }} onClick={onOpenAdd}>
                <i className="fas fa-plus"></i> Add Certificate
              </button>
            )}
          </div>
        </div>

        <div className="certificates-grid">
          {loading ? (
            <>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
              <div className="loading-skeleton"></div>
            </>
          ) : certs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-award"></i>
              <p>Certificates will appear here soon.</p>
            </div>
          ) : certs.map(cert => (
            <div className="cert-card reveal" key={cert.id || cert.ID}>
              {isAdmin && (
                <div className="admin-actions">
                  <button className="admin-btn edit" onClick={() => onOpenEdit(cert)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="admin-btn delete" onClick={() => handleDelete(cert.id || cert.ID)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
              <div className="cert-card-image-wrapper">
                <img
                  src={cert.image_url || cert.ImageURL || 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&q=80'}
                  alt={cert.name || cert.Name}
                  className="cert-card-image"
                  loading="lazy"
                />
              </div>
              <div className="cert-card-body">
                <h3 className="cert-card-name">{cert.name || cert.Name}</h3>
                <p className="cert-card-issuer"><i className="fas fa-building"></i> {cert.issuer || cert.Issuer}</p>
                <p className="cert-card-date"><i className="fas fa-calendar-alt"></i> {cert.date_earned || cert.DateEarned}</p>
                <a href={cert.credential_url || cert.CredentialURL || '#'} target="_blank" rel="noreferrer" className="cert-card-link">
                  View Credential <i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certificates;
