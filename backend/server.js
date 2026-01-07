const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let messages = [
  { id: 1, text: 'Welcome to your full stack app!', timestamp: new Date().toISOString() },
  { id: 2, text: 'This is a basic example', timestamp: new Date().toISOString() }
];

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const newMessage = {
    id: messages.length + 1,
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(msg => msg.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
