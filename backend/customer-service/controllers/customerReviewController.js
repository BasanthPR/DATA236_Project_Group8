// controllers/customerReviewController.js
import CustomerReview from '../models/customerReview.js';

export const addCustomerReview = async (req, res) => {
  try {
    const { driverId, rating, comment } = req.body;
    const customerId = req.user.id; // Get user ID from req.user instead of req.userId

    if (!driverId || !rating) {
      return res.status(400).json({ message: 'driverId and rating are required' });
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if customer has already reviewed this driver
    const existingReview = await CustomerReview.findOne({ customerId, driverId });
    if (existingReview) {
      // Update existing review instead of creating a new one
      existingReview.rating = rating;
      existingReview.comment = comment || '';
      await existingReview.save();

      return res.status(200).json({
        message: 'Review updated successfully',
        review: existingReview
      });
    }

    // Create new review
    const review = new CustomerReview({
      customerId,
      driverId,
      rating,
      comment: comment || ''
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (err) {
    console.error('Error in addCustomerReview:', err);
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

export const getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.user.id; // Get user ID from req.user instead of req.userId
    
    // Remove the populate call that's causing the error
    const reviews = await CustomerReview.find({ customerId });

    res.status(200).json({
      totalReviews: reviews.length,
      reviews
    });
  } catch (err) {
    console.error('Error in getCustomerReviews:', err);
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};