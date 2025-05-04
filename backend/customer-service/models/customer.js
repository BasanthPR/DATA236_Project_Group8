// models/customer.js
import mongoose from 'mongoose';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL',
  'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT',
  'NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const creditCardSchema = new mongoose.Schema({
  cardType:    { type: String, enum: ['VISA','MASTERCARD','AMEX','DISCOVER'], required: true },
  last4Digits: { type: String, required: true, match: [/^\d{4}$/, 'Invalid card number format'] },
  expiryMonth: { type: String, required: true, match: [/^(0[1-9]|1[0-2])$/, 'Invalid expiry month'] },
  expiryYear:  { type: String, required: true, match: [/^20\d{2}$/, 'Invalid expiry year'] }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  customerId:  { type: String, required: true, unique: true, match: [/^\d{3}-\d{2}-\d{4}$/, 'Invalid customer ID format'] },
  firstName:   { type: String, required: true, trim: true },
  lastName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] },
  phoneNumber: { type: String, required: true, match: [/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number format'] },
  address:     { type: String, required: true },
  city:        { type: String, required: true },
  state:       { type: String, required: true, enum: US_STATES },
  zipCode:     { type: String, required: true, match: [/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'] },
  creditCard:  creditCardSchema,
  rides:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }]
}, { timestamps: true });

customerSchema.index({ customerId: 1, email: 1 });
export default mongoose.model('Customer', customerSchema);
