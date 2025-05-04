import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Ride from '../models/ride.js';
import kafkaClient from '../utils/kafkaClient.js';
import logger from '../utils/logger.js';
import axios from 'axios';

// Controller for creating a new ride request
export const createRideRequest = asyncHandler(async (req, res) => {
  const { customerId, pickup, dropoff } = req.body;

  // Generate a unique ride ID
  const rideId = `RIDE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  let predictedFare = 5.0; // Default if ML fails

  // Call ML microservice for fare prediction
  try {
    const mlResponse = await axios.post('http://localhost:8000/predict_fare', {
      pickup_latitude:  pickup.latitude,
      pickup_longitude: pickup.longitude,
      dropoff_latitude: dropoff.latitude,
      dropoff_longitude: dropoff.longitude,
      passenger_count:  1,
      pickup_datetime:  new Date().toISOString(),
    });

    logger.info('🔎 ML response payload:', mlResponse.data);
    const fareVal = mlResponse.data.predicted_fare;
    if (typeof fareVal === 'number') {
      predictedFare = fareVal;
    } else {
      logger.warn('⚠️ Unexpected ML response format, falling back to default fare');
    }
  } catch (mlErr) {
    logger.error('⚠️ Failed to get predicted fare:', mlErr.message);
  }

  // Build Ride document
  const ride = new Ride({
    rideId,
    customerId,
    driverId:    'PENDING',
    pickup,
    dropoff,
    status:      'REQUESTED',
    requestTime: new Date(),
    fare: {
      baseFare:        5,
      distanceFare:    0,
      timeFare:        0,
      surgeMultiplier: 1.0,
      totalFare:       predictedFare,
    },
  });

  await ride.save();

  // Publish event to Kafka
  try {
    await kafkaClient.publish('ride-requests', {
      rideId,
      customerId,
      pickup,
      dropoff,
      estimatedFare: predictedFare,
    });
    logger.info(`📤 Published ride request ${rideId} to Kafka`);
  } catch (pubErr) {
    logger.error('⚠️ Kafka publish error:', pubErr.message);
  }

  res.status(StatusCodes.CREATED).json(ride);
});

// Controller for updating an existing ride
export const updateRideDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const ride = await Ride.findOneAndUpdate({ rideId: id }, update, { new: true });

  if (!ride) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Ride not found' });
  }
  res.json(ride);
});

// Controller for cancelling a ride
export const cancelOrDeleteRide = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ride = await Ride.findOne({ rideId: id });

  if (!ride) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Ride not found' });
  }
  if (ride.status === 'COMPLETED') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot cancel a completed ride' });
  }

  ride.status = 'CANCELLED';
  await ride.save();

  res.json({ message: 'Ride cancelled', ride });
});

// Controller for fetching rides by customer
export const getUserRides = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { status, page = 1, limit = 10 } = req.query;

  const query = { customerId };
  if (status) query.status = status;

  const rides = await Ride.find(query)
    .sort({ requestTime: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Ride.countDocuments(query);
  res.json({
    rides,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
  });
});

// Controller for fetching rides by driver
export const getDriverRides = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const rides = await Ride.find({ driverId });
  res.json(rides);
});

// Controller for ride stats by pickup location
export const getStatsByLocation = asyncHandler(async (req, res) => {
  const stats = await Ride.aggregate([
    { $group: { _id: '$pickup.address', count: { $sum: 1 } } }
  ]);
  res.json(stats);
});

// Controller stub for nearby drivers
export const getNearbyDrivers = asyncHandler(async (req, res) => {
  res.json({ message: 'Nearby drivers functionality not implemented' });
});
