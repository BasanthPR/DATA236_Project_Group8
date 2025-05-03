import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const locationSchema = Joi.object({
  address: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

const rideRequestSchema = Joi.object({
  customerId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).required(),
  pickup: locationSchema.required(),
  dropoff: locationSchema.required()
});

export function validateRideRequest(req, res, next) {
  const { error } = rideRequestSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message
    });
  }

  next();
}
