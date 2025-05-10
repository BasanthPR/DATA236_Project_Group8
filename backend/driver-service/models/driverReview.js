// models/driverReview.js
import mongoose from 'mongoose'

const { Schema, model } = mongoose

const driverReviewSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref:  'User',
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref:  'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

export default model('DriverReview', driverReviewSchema)
