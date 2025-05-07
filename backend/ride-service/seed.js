// ride-service/seedRides.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ride from './models/ride.js';

// load MONGO_URI from .env
dotenv.config();

async function generateRandomRides(count = 10000) {
  const statuses = ['REQUESTED','ACCEPTED','ARRIVED','IN_PROGRESS','COMPLETED','CANCELLED'];

  const rides = Array.from({ length: count }, () => {
    // random coords around San Francisco, for example
    const pickLat  = 37.70  + Math.random() * 0.2;
    const pickLng  = -122.55 + Math.random() * 0.2;
    const dropLat  = 37.70  + Math.random() * 0.2;
    const dropLng  = -122.55 + Math.random() * 0.2;

    return {
      rideId:       new mongoose.Types.ObjectId().toHexString(),
      customerId:   new mongoose.Types.ObjectId().toHexString(),
      driverId:     new mongoose.Types.ObjectId().toHexString(),
      pickup:  { latitude: pickLat,     longitude: pickLng,     address: `Pickup Addr ${Math.floor(Math.random()*1000)}` },
      dropoff: { latitude: dropLat,     longitude: dropLng,     address: `Dropoff Addr ${Math.floor(Math.random()*1000)}` },
      status:      statuses[Math.floor(Math.random() * statuses.length)],
      requestTime: new Date(Date.now() - Math.random() * 1e10),   // sometime in the past ~4 months
      startTime:   null,
      endTime:     null,
      fare: {
        baseFare:        5.0,
        distanceFare:    +(Math.random() * 20).toFixed(2),
        timeFare:        +(Math.random() * 5).toFixed(2),
        surgeMultiplier: Math.random() < 0.2 ? 1.5 : 1.0,
        totalFare:       0
      }
    };
  }).map(r => {
    // compute totalFare = base + distance + time, with surge
    const tf = (r.fare.baseFare + r.fare.distanceFare + r.fare.timeFare) * r.fare.surgeMultiplier;
    return { ...r, fare: { ...r.fare, totalFare: +tf.toFixed(2) } };
  });

  console.log(`Generated ${rides.length} ride objects`);
  return rides;
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const rides = await generateRandomRides(10000);
    await Ride.insertMany(rides);
    console.log('✅ Inserted 10,000 rides');

  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected');
    process.exit(0);
  }
}

main();
