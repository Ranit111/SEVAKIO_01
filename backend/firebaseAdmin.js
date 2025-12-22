const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount = null;

// 1) Try FIREBASE_SERVICE_ACCOUNT JSON string
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err.message || err);
  }
}

// 2) Try FIREBASE_SERVICE_ACCOUNT_PATH env (path to JSON file)
if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const saPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const raw = fs.readFileSync(saPath, 'utf8');
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read/parse FIREBASE_SERVICE_ACCOUNT_PATH file:', err.message || err);
  }
}

// 3) Fallback to local serviceAccountKey.json in backend folder
if (!serviceAccount) {
  try {
    const localPath = path.resolve(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf8');
      serviceAccount = JSON.parse(raw);
    }
  } catch (err) {
    // ignore here; will try application default next
  }
}

// Initialize Admin SDK
let initialized = false;
if (serviceAccount) {
  try {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase Admin initialized using service account.');
    initialized = true;
  } catch (err) {
    console.error('Failed to initialize Firebase Admin with service account:', err.message || err);
  }
} else {
  // Try Application Default Credentials (e.g., GOOGLE_APPLICATION_CREDENTIALS or GCE metadata)
  try {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    console.log('Firebase Admin initialized using application default credentials.');
    initialized = true;
  } catch (err) {
    console.error('Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT, FIREBASE_SERVICE_ACCOUNT_PATH, or GOOGLE_APPLICATION_CREDENTIALS.');
    console.error('Application default init error:', err.message || err);
  }
}

if (!initialized) {
  console.error('Firebase Admin SDK is not initialized — protected routes that verify tokens will fail.');
}

module.exports = admin;

