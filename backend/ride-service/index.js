import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rideRoutes from './routes/ride.js';
import kafkaClient from './utils/kafkaClient.js'; // ✅ import your Kafka client

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Main ride routes
app.use('/api/rides', rideRoutes);

// ✅ Optional: Mapbox token endpoint
app.get('/api/mapbox-token', (req, res) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token not found in environment' });
  }
  res.json({ token });
});

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride-service';

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Ride Service connected to MongoDB');

    await kafkaClient.connect(); // ✅ Connect to Kafka before handling requests
    console.log('✅ Kafka connected');

    app.listen(PORT, () =>
      console.log(`🚀 Ride Service running on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Startup error:', err.message);
  }
}

startServer();
