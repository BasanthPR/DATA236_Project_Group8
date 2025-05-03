import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rideRoutes from './routes/ride.js';

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Set up route
app.use('/api/rides', rideRoutes);

// (Optional) Mapbox token route:
app.get('/api/mapbox-token', (req, res) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token not found in environment' });
  }
  res.json({ token });
});

const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride-service';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Ride Service connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Ride Service running on port ${PORT}`));
  })
  .catch(err => console.error(err));
