import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  rideId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  driverId: { type: String, required: true },
  pickup: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String
  },
  dropoff: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'REQUESTED'
  },
  requestTime: { type: Date, default: Date.now },
  startTime: Date,
  endTime: Date,
  fare: {
    baseFare: Number,
    distanceFare: Number,
    timeFare: Number,
    surgeMultiplier: Number,
    totalFare: Number
  }
}, {
  timestamps: true
});

rideSchema.index({ rideId: 1 }, { unique: true });
rideSchema.index({ customerId: 1 });
rideSchema.index({ driverId: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ requestTime: -1 });

const Ride = mongoose.model('Ride', rideSchema);
export default Ride; // ✅ ESM export
