import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/admin-service';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Admin Service connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Admin Service running on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

startServer();
