// controllers/customerReviewController.js
import CustomerReview from '../models/customerReview.js';

// Add a review (customer only)
export const addReview = async (req, res, next) => {
  try {
    const r = new CustomerReview({
      ...req.body,
      customerId: req.user.id
    });
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
};

// Get all own reviews (or all if admin)
export const getReviews = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { customerId: req.user.id };
    const reviews = await CustomerReview.find(filter);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// Update a single review (owner or admin)
export const updateReview = async (req, res, next) => {
  try {
    const review = await CustomerReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && review.customerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    next(err);
  }
};

// Delete a review (owner or admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await CustomerReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && review.customerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await review.remove();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
