// // models/customer.js
// import mongoose from 'mongoose';

// const rideHistorySchema = new mongoose.Schema({
//   rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
//   date: Date,
//   from: String,
//   to: String,
//   fare: Number
// }, { _id: false });

// const creditCardSchema = new mongoose.Schema({
//   cardNumber: { type: String, required: true },
//   expiryMonth: Number,
//   expiryYear: Number,
//   cvv: String
// }, { _id: false });

// const customerSchema = new mongoose.Schema({
//   ssn: { type: String, unique: true, required: flase },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   address: String,
//   city: String,
//   state: String,
//   zipCode: String,
//   phoneNumber: String,
//   email: { type: String, unique: true, required: false },
//   creditCard: creditCardSchema,
//   ridesHistory: [rideHistorySchema],
//   rating: { type: Number, min: 0, max: 5, default: 0 },
//   reviews: [String]
// }, { timestamps: true });

// export default mongoose.model('Customer', customerSchema);
//----------------------------------------------------------------------------------------------------------------
// models/customer.js
// import mongoose from 'mongoose';

// const rideHistorySchema = new mongoose.Schema({
//   rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
//   date: Date,
//   from: String,
//   to: String,
//   fare: Number
// }, { _id: false });

// const creditCardSchema = new mongoose.Schema({
//   cardNumber: { 
//     type: String, 
//     required: true,
//     select: false // Don't include full card number in queries by default
//   },
//   last4Digits: String,
//   cardType: String,
//   expiryMonth: Number,
//   expiryYear: Number,
//   cvv: { 
//     type: String,
//     select: false // Don't include CVV in queries by default
//   }
// }, { _id: false });

// const reviewSchema = new mongoose.Schema({
//   driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
//   rating: { type: Number, min: 1, max: 5 },
//   comment: String,
//   date: { type: Date, default: Date.now }
// }, { _id: false });

// const customerSchema = new mongoose.Schema({
//   ssn: { 
//     type: String, 
//     unique: true, 
//     required: false,
//     validate: {
//       validator: function(v) {
//         return /^\d{3}-\d{2}-\d{4}$/.test(v);
//       },
//       message: props => `${props.value} is not a valid SSN! Format should be XXX-XX-XXXX.`
//     }
//   },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   address: String,
//   city: String,
//   state: { 
//     type: String,
//     validate: {
//       validator: function(v) {
//         if (!v) return true; // Allow empty
        
//         const validAbbreviations = [
//           'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
//           'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
//           'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
//           'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
//           'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
//         ];
        
//         const validStateNames = [
//           'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
//           'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
//           'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
//           'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
//           'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
//           'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
//           'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
//           'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
//           'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
//           'West Virginia', 'Wisconsin', 'Wyoming'
//         ];
        
//         return validAbbreviations.includes(v.toUpperCase()) || 
//                validStateNames.includes(v);
//       },
//       message: props => `${props.value} is not a valid state!`
//     }
//   },
//   zipCode: { 
//     type: String,
//     validate: {
//       validator: function(v) {
//         if (!v) return true; // Allow empty
//         return /^\d{5}(-\d{4})?$/.test(v);
//       },
//       message: props => `${props.value} is not a valid zip code! Format should be XXXXX or XXXXX-XXXX.`
//     }
//   },
//   phoneNumber: String,
//   email: { type: String, unique: true, required: true },
//   creditCard: creditCardSchema,
//   ridesHistory: [rideHistorySchema],
//   rating: { type: Number, min: 0, max: 5, default: 0 },
//   reviews: [reviewSchema]
// }, { timestamps: true });

// // Virtual for full name
// customerSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Index for efficient queries
// customerSchema.index({ email: 1 });
// customerSchema.index({ ssn: 1 });

// export default mongoose.model('Customer', customerSchema);
//-----------------------------------------------------------------------------------------------------------

// models/customer.js
import mongoose from 'mongoose';

const rideHistorySchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  date: Date,
  from: String,
  to: String,
  fare: Number
}, { _id: false });

const creditCardSchema = new mongoose.Schema({
  cardNumber: { 
    type: String, 
    required: true,
    select: false // Don't include full card number in queries by default
  },
  last4Digits: String,
  cardType: String,
  expiryMonth: Number,
  expiryYear: Number,
  cvv: { 
    type: String,
    select: false // Don't include CVV in queries by default
  }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  // Link to user in auth service
  userId: { type: String, required: true, unique: true },
  
  // SSN is now sparse (allows multiple null values)
  ssn: { 
    type: String, 
    sparse: true, // This is the key fix - allows multiple null values
    validate: {
      validator: function(v) {
        // If SSN is not provided, it's valid
        if (!v) return true;
        
        // Otherwise check format
        return /^\d{3}-\d{2}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid SSN format!`
    }
  },
  
  // Customer ID in SSN format 
  customerId: { 
    type: String, 
    unique: true, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{3}-\d{2}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid customer ID format!`
    }
  },
  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: String,
  city: String,
  state: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        
        const validAbbreviations = [
          'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
          'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
          'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
          'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
          'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];
        
        const validStateNames = [
          'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
          'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
          'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
          'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
          'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
          'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
          'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
          'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
          'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
          'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        
        return validAbbreviations.includes(v.toUpperCase()) || 
               validStateNames.includes(v);
      },
      message: props => `${props.value} is not a valid state!`
    }
  },
  zipCode: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^\d{5}(-\d{4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid zip code! Format should be XXXXX or XXXXX-XXXX.`
    }
  },
  phoneNumber: String,
  email: { type: String, unique: true, required: true },
  creditCard: creditCardSchema,
  ridesHistory: [rideHistorySchema],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for efficient queries
customerSchema.index({ email: 1 });
customerSchema.index({ userId: 1 });
customerSchema.index({ customerId: 1 });

export default mongoose.model('Customer', customerSchema);