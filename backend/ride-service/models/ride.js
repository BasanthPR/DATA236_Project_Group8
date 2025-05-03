import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    pickupCoords: [Number],
    dropoffCoords: [Number],
    time: { type: String }, // can be Date if using timestamps
    additionalStops: [String],
    status: {
      type: String,
      enum: ["requested", "in-progress", "completed", "cancelled"],
      default: "requested",
    },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    area: { type: String }
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;
