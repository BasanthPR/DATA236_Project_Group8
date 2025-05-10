// models/driver.js
import mongoose from "mongoose";

const carDetailsSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  plateNumber: { type: String, required: true }
}, { _id: false });

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{3}-\d{2}-\d{4}$/, 'driverId must be SSN format (###-##-####)']
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  carDetails: {
    type: carDetailsSchema,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  imageUrl: {
      type: String,
      default: ''    // will hold your Cloudinary image URL
    },
    videoUrl: {
      type: String,
      default: ''    // will hold your Cloudinary video URL
    },
      // ← Add these
  isAvailable:    { type: Boolean, default: false },
  ridesCompleted: { type: Number,  default: 0 },
  rating:         { type: Number,  default: 0 },
  reviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating:     { type: Number, min: 1, max: 5 },
      comment:    String,
      createdAt:  { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

//Enable geospatial queries on location
driverSchema.index({ location: "2dsphere" });

export default mongoose.model('Driver', driverSchema);
