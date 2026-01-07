# Full Stack Message Board

A basic full stack application with a Node.js/Express backend and React frontend.

## Project Structure

```
basecamp-app/
├── backend/          # Express API server
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── App.jsx   # Main App component
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Features

- View messages
- Add new messages
- Delete messages
- REST API with CRUD operations
- Modern React UI with Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server (from the `backend` directory):
```bash
npm run dev
```
The backend will run on http://localhost:3001

2. In a new terminal, start the frontend (from the `frontend` directory):
```bash
npm run dev
```
The frontend will run on http://localhost:3000

3. Open your browser and navigate to http://localhost:3000

## API Endpoints

- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create a new message
- `DELETE /api/messages/:id` - Delete a message by ID

## Tech Stack

**Backend:**
- Node.js
- Express
- CORS

**Frontend:**
- React 18
- Vite
- CSS3
