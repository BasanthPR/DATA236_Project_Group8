const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
    logger.error(`[${err.name}] ${err.message}`);
    logger.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: err.message
        });
    }

    // MongoDB duplicate key error
    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(StatusCodes.CONFLICT).json({
            message: 'Duplicate record found'
        });
    }

    // Custom status code (e.g., err.statusCode set in custom logic)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message || 'Unexpected error'
        });
    }

    // Fallback 500
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong'
    });
};
