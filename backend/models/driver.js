import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: String,
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const carDetailsSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    plateNumber: { type: String, required: true }
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
    {
      // SSN format: XXX-XX-XXXX
      driverId: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{3}-\d{2}-\d{4}$/
      },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phoneNumber: {
        type: String,
        match: [/^\d{3}-\d{3}-\d{4}$/, 'Please enter a valid phone number (XXX-XXX-XXXX)']
      },
      email: { 
        type: String, 
        unique: true, 
        required: true, 
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
      },
      password: { type: String, required: true }, // hashed
      carDetails: { type: carDetailsSchema, required: true },
      rating: { type: Number, min: 0, max: 5, default: 0 },
      reviews: [reviewSchema],
      introductionImages: [String], // URLs or file paths
      introductionVideo: String,   // URL or file path
      ridesHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ride" }]
    },
    { timestamps: true }
  );
  
  const Driver = mongoose.model("Driver", driverSchema);
  export default Driver;