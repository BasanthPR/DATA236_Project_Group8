// models/customer.js
import mongoose from 'mongoose';

const rideHistorySchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  date: Date,
  from: String,
  to: String,
  fare: Number
}, { _id: false });

const creditCardSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  expiryMonth: Number,
  expiryYear: Number,
  cvv: String
}, { _id: false });

const customerSchema = new mongoose.Schema({
  ssn: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phoneNumber: String,
  email: { type: String, unique: true, required: false },
  creditCard: creditCardSchema,
  ridesHistory: [rideHistorySchema],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: [String]
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
