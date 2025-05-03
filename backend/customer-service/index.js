import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoute.js';
import reviewRoutes from './routes/customerReviewRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

// Set up routes
app.use('/api/customer/profile', profileRoutes);
app.use('/api/customer/reviews', reviewRoutes);

const PORT = process.env.PORT || 4005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/customer-service';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Customer Service connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Customer Service running on port ${PORT}`));
  })
  .catch(err => console.error(err));
