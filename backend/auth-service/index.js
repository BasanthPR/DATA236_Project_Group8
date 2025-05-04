import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('✅ Auth Service is running');
});

// MongoDB URI and Port
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-service';

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(' ✅ Connected to MongoDB (auth-service)');

    app.listen(PORT, () => {
      console.log(` ✅ Auth Service running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' ✅ MongoDB connection error (auth-service):', err.message);
    process.exit(1); // Exit if connection fails
  }
};

startServer();
