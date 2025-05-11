// models/driver.js
import mongoose from "mongoose";

const carDetailsSchema = new mongoose.Schema({
  make: { 
    type: String, 
    required: true,
    trim: true
  },
  model: { 
    type: String, 
    required: true,
    trim: true
  },
  year: { 
    type: Number, 
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  plateNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5,
    required: true
  },
  comment: String,
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const driverSchema = new mongoose.Schema({
  // Link to user in auth service
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  
  driverId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^\d{3}-\d{2}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid driver ID format!`
    }
  },

  firstName: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  lastName: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  email: { 
    type: String, 
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  
  phoneNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  
  address: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  
  city: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  state: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        const validAbbreviations = [
          'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
          'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
          'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
          'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
          'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];
        return validAbbreviations.includes(v.toUpperCase());
      },
      message: props => `${props.value} is not a valid state abbreviation!`
    }
  },
  
  zipCode: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{5}(-\d{4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid zip code! Format should be XXXXX or XXXXX-XXXX.`
    }
  },
  
  carDetails: {
    type: carDetailsSchema,
    required: true
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates!'
      }
    }
  },
  
  imageUrl: {
    type: String,
    default: ''
  },
  
  videoUrl: {
    type: String,
    default: ''
  },
  
  isAvailable: { 
    type: Boolean, 
    default: false 
  },
  
  ridesCompleted: { 
    type: Number,  
    default: 0,
    min: 0
  },
  
  rating: { 
    type: Number,  
    default: 0,
    min: 0,
    max: 5
  },
  
  reviews: [reviewSchema],
  
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{6,12}$/.test(v);
      },
      message: props => `${props.value} is not a valid license number! Must be 6-12 alphanumeric characters.`
    }
  }
}, { timestamps: true });

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Enable geospatial queries on location
driverSchema.index({ location: '2dsphere' });

export default mongoose.model('Driver', driverSchema);
