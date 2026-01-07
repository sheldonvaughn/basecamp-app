import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

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

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage }),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
      });
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
      <h1>Full Stack Message Board</h1>

      <form onSubmit={addMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter a message..."
          className="message-input"
        />
        <button type="submit" className="add-button">Add Message</button>
      </form>

      <div className="messages-list">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Add one above!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <p className="message-text">{msg.text}</p>
              <div className="message-footer">
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
