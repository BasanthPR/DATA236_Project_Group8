// controllers/customerController.js
import Customer from '../models/customer.js';

// Create customer details (after login)
export const createCustomer = async (req, res) => {
  const userEmail = req.user.email;
  const { ssn, firstName, lastName, address, city, state, zipCode, phoneNumber, creditCard } = req.body;
  try {
    if (await Customer.findOne({ email: userEmail })) {
      return res.status(400).json({ message: 'Customer details already exist' });
    }
    const customer = new Customer({
      ssn, firstName, lastName, address, city, state, zipCode,
      phoneNumber, email: userEmail,
      creditCard,
      ridesHistory: [],
      rating: 0,
      reviews: []
    });
    await customer.save();
    return res.status(201).json(customer);
  } catch (err) {
    console.error('❌ Create customer error:', err.message);
    return res.status(500).json({ message: 'Failed to create customer', error: err.message });
  }
};

// Get customer details
export const getCustomer = async (req, res) => {
  const userEmail = req.user.email;
  try {
    const customer = await Customer.findOne({ email: userEmail });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    return res.status(200).json(customer);
  } catch (err) {
    console.error('❌ Get customer error:', err.message);
    return res.status(500).json({ message: 'Failed to get customer', error: err.message });
  }
};

// Update customer details
export const updateCustomer = async (req, res) => {
  const userEmail = req.user.email;
  const updates = req.body;
  try {
    const customer = await Customer.findOneAndUpdate(
      { email: userEmail },
      updates,
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    return res.status(200).json(customer);
  } catch (err) {
    console.error('❌ Update customer error:', err.message);
    return res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
};
