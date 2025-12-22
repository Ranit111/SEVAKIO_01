const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

console.log('MONGO_URI=', process.env.MONGO_URI);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI environment variable is not set. MongoDB connection will be skipped.');
    return null;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = {
  connectDB,
  connection: mongoose.connection,
};
