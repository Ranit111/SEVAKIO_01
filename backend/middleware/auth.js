const admin = require('../firebaseAdmin');

// Express middleware to verify Firebase ID token from Authorization header
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ error: 'Unauthorized: missing Authorization header' });
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : parts[0];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: missing token' });
    }

    // Verify token using Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);
    // Attach decoded token to request for downstream handlers
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('Firebase token verification failed:', err && err.message ? err.message : err);
    return res.status(401).json({ error: 'Unauthorized: invalid token', message: err && err.message });
  }
};
