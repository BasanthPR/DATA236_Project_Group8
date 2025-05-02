import CustomerReview from '../models/customerReview.js';

export const addCustomerReview = async (req, res) => {
  try {
    const { driverId, rating, comment } = req.body;
    const customerId = req.userId;

    if (!driverId || !rating) {
      return res.status(400).json({ message: 'driverId and rating are required' });
    }

    const review = new CustomerReview({
      customerId,
      driverId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

export const getCustomerReviews = async (req, res) => {
  try {
    const reviews = await CustomerReview.find({ customerId: req.userId })
      .populate('driverId', 'firstName lastName');

    res.status(200).json({
      totalReviews: reviews.length,
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};
