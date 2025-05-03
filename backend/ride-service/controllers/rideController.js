import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Ride from '../models/ride.js';
import kafkaClient from '../utils/kafkaClient.js';
import logger from '../utils/logger.js';
import axios from 'axios';

export const createRideRequest = asyncHandler(async (req, res) => {
  const { customerId, pickup, dropoff } = req.body;

  try {
    const rideId = `RIDE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let predictedFare = 5.00;

    try {
      const response = await axios.post('http://localhost:8000/predict_fare/', {
        pickup_latitude: pickup.coordinates[1],
        pickup_longitude: pickup.coordinates[0],
        dropoff_latitude: dropoff.coordinates[1],
        dropoff_longitude: dropoff.coordinates[0],
        passenger_count: 1,
        pickup_datetime: new Date().toISOString()
      });

      predictedFare = response.data.predicted_fare;
    } catch (mlErr) {
      console.error('⚠️ Failed to get predicted fare:', mlErr.message);
    }

    const ride = new Ride({
      rideId,
      customerId,
      driverId: 'PENDING',
      pickup,
      dropoff,
      status: 'REQUESTED',
      requestTime: new Date(),
      fare: {
        baseFare: 5,
        distanceFare: 0,
        timeFare: 0,
        surgeMultiplier: 1.0,
        totalFare: predictedFare
      }
    });

    await ride.save();

    try {
      await kafkaClient.publish('ride-requests', {
        rideId: ride.rideId,
        customerId: ride.customerId,
        pickup,
        dropoff,
        estimatedFare: predictedFare
      });
    } catch (error) {
      console.error('⚠️ Kafka publish error:', error.message);
    }

    res.status(StatusCodes.CREATED).json(ride);
  } catch (error) {
    console.error('❌ Ride creation error:', error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create ride',
      error: error.message
    });
  }
});

export const updateRideDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const ride = await Ride.findOneAndUpdate({ rideId: id }, update, { new: true });

  if (!ride) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Ride not found' });
  }

  res.json(ride);
});

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
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    }
  });
});

export const getDriverRides = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const rides = await Ride.find({ driverId });

  res.json(rides);
});

export const getStatsByLocation = asyncHandler(async (req, res) => {
  const stats = await Ride.aggregate([
    { $group: { _id: '$pickup.address', count: { $sum: 1 } } }
  ]);

  res.json(stats);
});

export const getNearbyDrivers = asyncHandler(async (req, res) => {
  res.json({ message: 'Nearby drivers functionality not implemented (requires Driver model)' });
});
