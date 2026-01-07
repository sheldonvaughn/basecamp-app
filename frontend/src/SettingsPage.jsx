import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SettingsPage.css';

const AUTH_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3001/api';

function SettingsPage() {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchOrganization();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${AUTH_URL}/user`, {
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`${API_URL}/organization`, {
        credentials: 'include',
      });
      const data = await response.json();
      setOrganization(data.organization);
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  const openAdminPortal = async (intent) => {
    setLoadingPortal(true);
    try {
      const response = await fetch(`${API_URL}/admin-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ intent }),
      });

      if (response.status === 401) {
        alert('Session expired. Please sign in again.');
        window.location.href = `${AUTH_URL}/login`;
        return;
      }

      const data = await response.json();

      // Check if we got an error response
      if (!response.ok || !data.link) {
        console.error('Admin Portal error:', data);
        alert(`Failed to generate Admin Portal link: ${data.message || data.error || 'Unknown error'}`);
        setLoadingPortal(false);
        return;
      }

      // Redirect to Admin Portal
      window.location.href = data.link;
    } catch (error) {
      console.error('Error opening Admin Portal:', error);
      alert('Failed to open Admin Portal. Please try again.');
      setLoadingPortal(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="settings-container">
        <div className="login-prompt">
          <h1>Settings</h1>
          <p>Please sign in to access settings.</p>
          <a href={`${AUTH_URL}/login`} className="settings-button primary">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>

      <div className="settings-content">
        {/* User Information Section */}
        <section className="settings-section">
          <h2>👤 User Information</h2>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email Verified:</span>
              <span className="info-value">
                {user.emailVerified ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </section>

        {/* Organization Section */}
        <section className="settings-section">
          <h2>🏢 Organization</h2>
          {organization ? (
            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{organization.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Organization ID:</span>
                <span className="info-value">{organization.id}</span>
              </div>
              {organization.domains && organization.domains.length > 0 && (
                <div className="info-row">
                  <span className="info-label">Domains:</span>
                  <span className="info-value">
                    {organization.domains.map((d) => d.domain).join(', ')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="info-card">
              <p>Loading organization information...</p>
            </div>
          )}
        </section>

        {/* Admin Portal Section */}
        <section className="settings-section admin-portal-section">
          <h2>🔐 Admin Portal</h2>
          <p className="section-description">
            Access the WorkOS Admin Portal to configure enterprise features for
            your organization.
          </p>

          <div className="portal-options">
            <div className="portal-option">
              <div className="portal-icon">🔑</div>
              <h3>Single Sign-On</h3>
              <p>Configure SSO with your identity provider (Okta, Azure AD, Google, etc.)</p>
              <button
                onClick={() => openAdminPortal('sso')}
                className="settings-button primary"
                disabled={loadingPortal}
              >
                {loadingPortal ? 'Loading...' : 'Configure SSO'}
              </button>
            </div>

            <div className="portal-option">
              <div className="portal-icon">📁</div>
              <h3>Directory Sync</h3>
              <p>Sync users and groups from your directory provider</p>
              <button
                onClick={() => openAdminPortal('dsync')}
                className="settings-button primary"
                disabled={loadingPortal}
              >
                {loadingPortal ? 'Loading...' : 'Configure Directory Sync'}
              </button>
            </div>

            <div className="portal-option">
              <div className="portal-icon">✅</div>
              <h3>Domain Verification</h3>
              <p>Verify your organization's domain ownership</p>
              <button
                onClick={() => openAdminPortal('domain_verification')}
                className="settings-button primary"
                disabled={loadingPortal}
              >
                {loadingPortal ? 'Loading...' : 'Verify Domain'}
              </button>
            </div>

            <div className="portal-option">
              <div className="portal-icon">📊</div>
              <h3>Audit Logs</h3>
              <p>Configure audit log exports for security and compliance</p>
              <button
                onClick={() => openAdminPortal('audit_logs')}
                className="settings-button primary"
                disabled={loadingPortal}
              >
                {loadingPortal ? 'Loading...' : 'Configure Audit Logs'}
              </button>
            </div>
          </div>

          <div className="portal-info">
            <p>
              <strong>Note:</strong> The Admin Portal link expires after 5
              minutes for security reasons. You'll be redirected back to this
              page when finished.
            </p>
          </div>
        </section>

        {/* Account Actions */}
        <section className="settings-section">
          <h2>🚪 Account Actions</h2>
          <div className="action-buttons">
            <a href={`${AUTH_URL}/logout`} className="settings-button danger">
              Sign Out
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
