// middleware/validators.js
import { body, query, validationResult } from 'express-validator';

/**
 * Validation rules for creating a driver profile
 */
export const createDriverRules = [
  body('licenseNumber')
    .exists().withMessage('licenseNumber is required')
    .isString().trim(),
  body('firstName')
    .exists().withMessage('firstName is required')
    .isString().trim(),
  body('lastName')
    .exists().withMessage('lastName is required')
    .isString().trim(),
  body('phoneNumber')
    .exists().withMessage('phoneNumber is required')
    .isMobilePhone().withMessage('phoneNumber must be a valid mobile number'),
  body('address')
    .exists().withMessage('address is required')
    .isString().trim(),
  body('city')
    .exists().withMessage('city is required')
    .isString().trim(),
  body('state')
    .exists().withMessage('state is required')
    .isString().trim(),
  body('zipCode')
    .exists().withMessage('zipCode is required')
    .isPostalCode('US').withMessage('zipCode must be a valid US postal code'),
  body('carDetails.make')
    .exists().withMessage('carDetails.make is required')
    .isString().trim(),
  body('carDetails.model')
    .exists().withMessage('carDetails.model is required')
    .isString().trim(),
  body('carDetails.year')
    .exists().withMessage('carDetails.year is required')
    .isInt({ min: 1900 }).withMessage('carDetails.year must be a valid year'),
  body('carDetails.plateNumber')
    .exists().withMessage('carDetails.plateNumber is required')
    .isString().trim(),
  body('location.latitude')
    .exists().withMessage('location.latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('location.latitude must be between -90 and 90'),
  body('location.longitude')
    .exists().withMessage('location.longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('location.longitude must be between -180 and 180'),
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
