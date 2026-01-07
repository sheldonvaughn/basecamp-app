import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api';
const AUTH_URL = 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchMessages();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${AUTH_URL}/user`, {
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`);
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const addMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!user) {
      alert('Please sign in to post messages');
      window.location.href = `${AUTH_URL}/login`;
      return;
    }

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: newMessage }),
      });

      if (response.status === 401) {
        alert('Session expired. Please sign in again.');
        window.location.href = `${AUTH_URL}/login`;
        return;
      }

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!user) {
      alert('Please sign in to delete messages');
      window.location.href = `${AUTH_URL}/login`;
      return;
    }

    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        alert('Session expired. Please sign in again.');
        window.location.href = `${AUTH_URL}/login`;
        return;
      }

      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Full Stack Message Board</h1>
        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span>Welcome, {user.firstName || user.email}!</span>
              <a href={`${AUTH_URL}/logout`} className="auth-button">Sign Out</a>
            </div>
          ) : (
            <a href={`${AUTH_URL}/login`} className="auth-button">Sign In</a>
          )}
        </div>
      </div>

      <form onSubmit={addMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={user ? "Enter a message..." : "Sign in to post messages..."}
          className="message-input"
          disabled={!user}
        />
        <button type="submit" className="add-button" disabled={!user}>Add Message</button>
      </form>

      <div className="messages-list">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Add one above!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                {msg.userFirstName && (
                  <span className="message-author">
                    {msg.userFirstName} {msg.userLastName}
                  </span>
                )}
              </div>
              <p className="message-text">{msg.text}</p>
              <div className="message-footer">
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
                {user && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
