// middleware/validators.js
import { body, query, validationResult } from 'express-validator';

/**
 * Validation rules for creating a driver profile
 */
export const createDriverRules = [
  body('licenseNumber')
    .exists().withMessage('licenseNumber is required')
    .isString().trim()
    .matches(/^[A-Z0-9]{6,12}$/).withMessage('licenseNumber must be 6-12 alphanumeric characters'),
  body('firstName')
    .exists().withMessage('firstName is required')
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage('firstName must be between 2 and 50 characters'),
  body('lastName')
    .exists().withMessage('lastName is required')
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage('lastName must be between 2 and 50 characters'),
  body('phoneNumber')
    .exists().withMessage('phoneNumber is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('phoneNumber must be a valid international number'),
  body('address')
    .exists().withMessage('address is required')
    .isString().trim()
    .isLength({ min: 5, max: 100 }).withMessage('address must be between 5 and 100 characters'),
  body('city')
    .exists().withMessage('city is required')
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage('city must be between 2 and 50 characters'),
  body('state')
    .exists().withMessage('state is required')
    .isString().trim()
    .isLength({ min: 2, max: 2 }).withMessage('state must be a 2-letter code')
    .isUppercase().withMessage('state must be uppercase')
    .isIn([
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]).withMessage('state must be a valid US state code'),
  body('zipCode')
    .exists().withMessage('zipCode is required')
    .matches(/^\d{5}(-\d{4})?$/).withMessage('zipCode must be in format XXXXX or XXXXX-XXXX'),
  body('carDetails.make')
    .exists().withMessage('carDetails.make is required')
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage('car make must be between 2 and 50 characters'),
  body('carDetails.model')
    .exists().withMessage('carDetails.model is required')
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage('car model must be between 2 and 50 characters'),
  body('carDetails.year')
    .exists().withMessage('carDetails.year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`car year must be between 1900 and ${new Date().getFullYear() + 1}`),
  body('carDetails.color')
    .exists().withMessage('carDetails.color is required')
    .isString().trim()
    .isLength({ min: 2, max: 30 }).withMessage('car color must be between 2 and 30 characters'),
  body('carDetails.plateNumber')
    .exists().withMessage('carDetails.plateNumber is required')
    .isString().trim()
    .isLength({ min: 2, max: 10 }).withMessage('plate number must be between 2 and 10 characters'),
  body('carDetails.vehicleType')
    .exists().withMessage('carDetails.vehicleType is required')
    .isString().trim()
    .isLength({ min: 2, max: 30 }).withMessage('vehicle type must be between 2 and 30 characters'),
  body('location.latitude')
    .exists().withMessage('location.latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude must be between -90 and 90'),
  body('location.longitude')
    .exists().withMessage('location.longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude must be between -180 and 180'),
];

/**
 * Validation rules for querying nearby drivers
 */
export const getNearbyDriversRules = [
  query('latitude')
    .exists().withMessage('latitude query param is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude must be between -90 and 90'),
  query('longitude')
    .exists().withMessage('longitude query param is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isInt({ min: 0 })
    .withMessage('radius must be a non-negative integer'),
];

/**
 * Validation rules for updating driver location
 */
export const updateLocationRules = [
  body('latitude')
    .exists().withMessage('latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude must be between -90 and 90'),
  body('longitude')
    .exists().withMessage('longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude must be between -180 and 180'),
];

/**
 * Validation rules for driver reviews
 */
export const reviewRules = [
  body('reviewerId')
    .exists().withMessage('reviewerId is required')
    .isMongoId().withMessage('reviewerId must be a valid MongoDB ID'),
  body('rating')
    .exists().withMessage('rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('comment must be less than 500 characters'),
];

/**
 * Middleware to check for validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return first  error array for clarity
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
