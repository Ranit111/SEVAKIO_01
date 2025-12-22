require("dotenv").config();

const express = require("express");
const cors = require('cors');
const { connectDB } = require("./db");
const usersRoutes = require("./routes/users");

const app = express();
// enable CORS for browser clients (adjust origin in production)
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is not set.");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB Connected`);
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
