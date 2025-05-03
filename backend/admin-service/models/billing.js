import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    billingId: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{3}-\d{2}-\d{3}$/,
    },
    date: Date,
    pickupTime: String,
    dropOffTime: String,
    distanceCovered: Number,
    totalAmount: Number,
    sourceLocation: String,
    destinationLocation: String,
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
