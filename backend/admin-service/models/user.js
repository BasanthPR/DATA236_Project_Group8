import mongoose from 'mongoose';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA',
  'WA', 'WV', 'WI', 'WY', 'District of Columbia', 'California', 'Texas', 'New York'
];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "driver", "customer"],
      default: "customer"
    },
    customerId: {
      type: String,
      match: [/^\d{3}-\d{2}-\d{4}$/, 'invalid_driver_id'],
      unique: true,
      default: null,
    },
    phoneNumber: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || US_STATES.includes(v);
        },
        message: 'malformed_state',
      },
      default: null,
    },
    zipCode: {
      type: String,
      match: [/^\d{5}(-\d{4})?$/, 'malformed_zip'],
      default: null,
    },
    creditCard: {
      cardType: { type: String, default: null },
      last4Digits: {
        type: String,
        match: [/^\d{4}$/, 'Invalid last4Digits'],
        default: null,
      },
      expiryMonth: { type: String, default: null },
      expiryYear: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
