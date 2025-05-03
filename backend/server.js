import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import rideRoutes from "./routes/ride.js";
import billingRoutes from "./routes/billing.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoute.js"; 
import driverRoutes from "./routes/driverRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/billing', billingRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/driver', driverRoutes); // Driver routes

app.use('/api/profile', profileRoutes); 

// Mapbox Token Route
app.get('/api/mapbox-token', (req, res) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token not found in environment' });
  }
  res.json({ token });
});

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGO_URI,)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('Connection error', err));
