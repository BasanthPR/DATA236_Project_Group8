import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import billingRoutes from './routes/billing.js';

dotenv.config();

const app = express();
app.use(express.json());

// Set up billing routes (including fare prediction)
app.use('/api/billing', billingRoutes);

const PORT = process.env.PORT || 4003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/billing-service';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Billing Service connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Billing Service running on port ${PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));
