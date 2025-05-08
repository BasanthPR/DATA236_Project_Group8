// billing-service/middleware/validators.js
import { body, param, query, validationResult } from 'express-validator';

export const createBillRules = [
  // Core billing fields
  body('date')
    .exists().withMessage('date is required')
    .isISO8601().withMessage('date must be ISO-format')
    .toDate(),
  body('pickupTime')
    .exists().withMessage('pickupTime is required')
    .isISO8601().withMessage('pickupTime must be ISO-format')
    .toDate(),
  body('dropOffTime')
    .exists().withMessage('dropOffTime is required')
    .isISO8601().withMessage('dropOffTime must be ISO-format')
    .toDate(),
  body('distanceCovered')
    .exists().withMessage('distanceCovered is required')
    .isFloat({ gt: 0 }).withMessage('distanceCovered must be > 0'),
  body('sourceLocation')
    .exists().withMessage('sourceLocation is required')
    .isString(),
  body('destinationLocation')
    .exists().withMessage('destinationLocation is required')
    .isString(),

  // Mongo IDs
  body('customerId')
    .exists().withMessage('customerId is required')
    .isMongoId().withMessage('customerId must be a valid ObjectId'),
  body('driverId')
    .exists().withMessage('driverId is required')
    .isMongoId().withMessage('driverId must be a valid ObjectId'),
  body('rideId')
    .exists().withMessage('rideId is required')
    .isMongoId().withMessage('rideId must be a valid ObjectId'),

  // ML predictor inputs
  body('pickup_latitude')
    .exists().withMessage('pickup_latitude is required')
    .isFloat({ min: -90, max:  90 }).withMessage('pickup_latitude out of range'),
  body('pickup_longitude')
    .exists().withMessage('pickup_longitude is required')
    .isFloat({ min:-180, max: 180 }).withMessage('pickup_longitude out of range'),
  body('dropoff_latitude')
    .exists().withMessage('dropoff_latitude is required')
    .isFloat({ min: -90, max:  90 }).withMessage('dropoff_latitude out of range'),
  body('dropoff_longitude')
    .exists().withMessage('dropoff_longitude is required')
    .isFloat({ min:-180, max: 180 }).withMessage('dropoff_longitude out of range'),
  body('passenger_count')
    .exists().withMessage('passenger_count is required')
    .isInt({ gt: 0 }).withMessage('passenger_count must be > 0'),
  body('pickup_datetime')
    .exists().withMessage('pickup_datetime is required')
    .isISO8601().withMessage('pickup_datetime must be ISO-format'),
];

export const searchBillsRules = [
  query('startDate').optional().isISO8601().withMessage('startDate must be ISO-format'),
  query('endDate').optional().isISO8601().withMessage('endDate must be ISO-format'),
  query('minAmount').optional().isFloat({ gt: 0 }).withMessage('minAmount must be > 0'),
  query('maxAmount').optional().isFloat({ gt: 0 }).withMessage('maxAmount must be > 0'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
];

export const idParamRule = (paramName) => [
  param(paramName)
    .exists().withMessage(`${paramName} is required`)
    .isMongoId().withMessage(`${paramName} must be a valid ObjectId`),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
// New: validate SSN-style billingId (3-2-4 digits)
export const billingIdParamRule = [
    param('billingId')
      .exists().withMessage('billingId is required')
      .matches(/^\d{3}-\d{2}-\d{4}$/)
        .withMessage('billingId must be in xxx-xx-xxxx format'),
  ];
  