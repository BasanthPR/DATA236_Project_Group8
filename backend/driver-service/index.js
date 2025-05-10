// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import driverRoutes from './routes/driverRoute.js';
import driverReviewRoutes from './routes/driverReviewRoute.js'

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/drivers', driverRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Driver Service' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`🚀 Driver Service listening on port ${PORT}`);
});
