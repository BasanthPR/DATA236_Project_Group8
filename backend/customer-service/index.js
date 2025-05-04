// index.js (Customer Service)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Customer routes
app.use('/api/customers', customerRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Customer Service is running');
});

// Server & DB config
const PORT = process.env.PORT || 4005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/customer-service';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB (customer-service)');
  app.listen(PORT, () => {
    console.log(`✅ Customer Service listening on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error (customer-service):', err.message);
  process.exit(1);
});
