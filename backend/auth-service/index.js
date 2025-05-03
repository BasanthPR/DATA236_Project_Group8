import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js'; // Customer/driver auth routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('✅ Auth Service is running');
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-service';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (auth-service)');
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error (auth-service):', err.message);
  });
