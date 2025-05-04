// index.js (entry point)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './routes/profileRoute.js';
import reviewRoutes   from './routes/customerReviewRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

// Mount
app.use('/api/customers', customerRoutes);
app.use('/api/customer/reviews', reviewRoutes);

// Health
app.get('/', (_req, res) => res.send('✅ Customer Service is running'));

const PORT    = process.env.PORT    || 4005;
const MONGO   = process.env.MONGO_URI || 'mongodb://localhost:27017/customer-service';

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
  })
  .catch(err => console.error(err));
