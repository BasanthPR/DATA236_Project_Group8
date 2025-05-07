import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  creditCard: String,
  role: {
    type: String,
    enum: ['admin', 'customer', 'driver'],
    required: true
  },
  vehicleDetails: {
    make: String,
    model: String,
    year: Number,
    licensePlate: String
  }
  // Add other shared fields
}, { timestamps: true });

export default userSchema;
