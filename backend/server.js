require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { WorkOS } = require('@workos-inc/node');

const app = express();
const PORT = 3001;

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

let messages = [
  { id: 1, text: 'Welcome to your full stack app!', timestamp: new Date().toISOString() },
  { id: 2, text: 'This is a basic example', timestamp: new Date().toISOString() }
];

// Auth middleware function
async function withAuth(req, res, next) {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const { authenticated, reason } = await session.authenticate();

  if (authenticated) {
    req.user = (await session.authenticate()).user;
    return next();
  }

  // If the cookie is missing, return 401
  if (!authenticated && reason === 'no_session_cookie_provided') {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // If the session is invalid, attempt to refresh
  try {
    const { authenticated, sealedSession } = await session.refresh();

    if (!authenticated) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Update the cookie
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });

    req.user = (await workos.userManagement.loadSealedSession({
      sessionData: sealedSession,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    }).authenticate()).user;

    return next();
  } catch (e) {
    res.clearCookie('wos-session');
    return res.status(401).json({ error: 'Not authenticated' });
  }
}

// Auth routes
app.get('/login', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: process.env.WORKOS_REDIRECT_URI,
    clientId: process.env.WORKOS_CLIENT_ID,
  });

  res.redirect(authorizationUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const authenticateResponse = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID,
      code,
      session: {
        sealSession: true,
        cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
      },
    });

    const { sealedSession } = authenticateResponse;

    // Store the session in a cookie
    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });

    // Redirect to frontend
    return res.redirect('http://localhost:3000');
  } catch (error) {
    console.error('Authentication error:', error);
    return res.redirect('http://localhost:3000');
  }
});

app.get('/logout', async (req, res) => {
  try {
    const session = workos.userManagement.loadSealedSession({
      sessionData: req.cookies['wos-session'],
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    });

    const url = await session.getLogoutUrl();

    res.clearCookie('wos-session');
    res.redirect(url);
  } catch (error) {
    // If there's no valid session, just clear the cookie and redirect to frontend
    res.clearCookie('wos-session');
    res.redirect('http://localhost:3000');
  }
});

app.get('/user', async (req, res) => {
  try {
    const session = workos.userManagement.loadSealedSession({
      sessionData: req.cookies['wos-session'],
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    });

    const { authenticated, user } = await session.authenticate();

    if (!authenticated) {
      return res.json({ user: null });
    }

    return res.json({ user });
  } catch (error) {
    return res.json({ user: null });
  }
});

// Message routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', withAuth, (req, res) => {
  const newMessage = {
    id: messages.length + 1,
    text: req.body.text,
    userId: req.user.id,
    userFirstName: req.user.firstName,
    userLastName: req.user.lastName,
    userEmail: req.user.email,
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', withAuth, (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(msg => msg.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
