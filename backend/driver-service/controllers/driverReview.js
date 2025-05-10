// controllers/driverReviewController.js
import DriverReview from '../models/driverReview.js'

/**
 * POST /api/driver/reviews
 * Body: { customerId, rating, comment? }
 * Authenticated as driver (req.user.id)
 */
export const addDriverReview = async (req, res) => {
  try {
    const driverId   = req.user.id
    const { customerId, rating, comment } = req.body

    if (!customerId || rating == null) {
      return res.status(400).json({ message: 'customerId and rating are required' })
    }

    // rating must be 1–5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // find existing
    const existing = await DriverReview.findOne({ driverId, customerId })
    if (existing) {
      existing.rating  = rating
      existing.comment = comment || ''
      await existing.save()

      return res.status(200).json({
        message: 'Review updated successfully',
        review:  existing
      })
    }

    // create new
    const review = new DriverReview({
      driverId,
      customerId,
      rating,
      comment: comment || ''
    })
    await review.save()

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    })

  } catch (err) {
    console.error('Error in addDriverReview:', err)
    res.status(500).json({ message: 'Failed to submit review', error: err.message })
  }
}

/**
 * GET /api/driver/reviews
 * Authenticated as driver (req.user.id)
 */
export const getDriverReviews = async (req, res) => {
  try {
    const driverId = req.user.id

    // fetch all reviews this driver has made
    const reviews = await DriverReview.find({ driverId })

    res.status(200).json({
      totalReviews: reviews.length,
      reviews
    })
  } catch (err) {
    console.error('Error in getDriverReviews:', err)
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message })
  }
}
