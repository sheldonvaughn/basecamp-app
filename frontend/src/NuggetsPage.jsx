import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NuggetsPage.css';

const AUTH_URL = 'http://localhost:3001';

function NuggetsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
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

  if (loading) {
    return (
      <div className="nuggets-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="nuggets-container">
        <div className="login-prompt">
          <h1 className="nuggets-title">🏀 DENVER NUGGETS FAN ZONE 🏀</h1>
          <div className="lock-icon">🔒</div>
          <p className="login-message">You must be authenticated to enter the sacred Nuggets zone!</p>
          <p className="login-subtitle">Only true fans with verified credentials may proceed.</p>
          <a href={`${AUTH_URL}/login`} className="nuggets-login-button">
            Sign In to See the Glory
          </a>
          <div className="nuggets-facts">
            <p>🏆 2023 NBA Champions</p>
            <p>👑 Nikola Jokić - 3x MVP</p>
            <p>⛰️ Mile High Basketball</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nuggets-container authenticated">
      <div className="nuggets-header">
        <h1 className="nuggets-main-title">🏀 WELCOME TO NUGGETS NATION 🏀</h1>
        <p className="championship-banner">🏆 2023 NBA CHAMPIONS 🏆</p>
      </div>

      <div className="user-showcase">
        <h2 className="showcase-title">
          {user.firstName ? `${user.firstName}, YOU'RE A TRUE NUGGETS FAN!` : 'TRUE NUGGETS FAN DETECTED!'}
        </h2>

        <div className="user-card">
          <div className="user-card-header">
            <span className="badge">VERIFIED FAN</span>
            <span className="badge mvp">MVP STATUS</span>
          </div>

          <div className="user-details">
            <div className="detail-row">
              <span className="label">Fan ID:</span>
              <span className="value">{user.id}</span>
            </div>
            {user.firstName && (
              <div className="detail-row">
                <span className="label">First Name:</span>
                <span className="value">{user.firstName}</span>
              </div>
            )}
            {user.lastName && (
              <div className="detail-row">
                <span className="label">Last Name:</span>
                <span className="value">{user.lastName}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            {user.emailVerified !== undefined && (
              <div className="detail-row">
                <span className="label">Email Verified:</span>
                <span className="value">{user.emailVerified ? '✅ Yes' : '❌ No'}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Member Since:</span>
              <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="json-section">
            <h3 className="json-title">🔍 Full Fan Profile (Raw Data)</h3>
            <pre className="json-display">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      </div>

      <div className="nuggets-facts-grid">
        <div className="fact-card">
          <div className="fact-icon">🃏</div>
          <h3>The Joker</h3>
          <p>Nikola Jokić - 3x MVP, NBA Champion, Finals MVP</p>
        </div>
        <div className="fact-card">
          <div className="fact-icon">⛰️</div>
          <h3>Mile High City</h3>
          <p>5,280 feet above sea level - Home court advantage!</p>
        </div>
        <div className="fact-card">
          <div className="fact-icon">🏆</div>
          <h3>2023 Champions</h3>
          <p>First championship in franchise history!</p>
        </div>
        <div className="fact-card">
          <div className="fact-icon">💙💛</div>
          <h3>Dig In!</h3>
          <p>Navy blue, gold, and skyline blue - Classic colors</p>
        </div>
      </div>

      <div className="back-link">
        <Link to="/">← Back to Message Board</Link>
      </div>
    </div>
  );
}

export default NuggetsPage;
