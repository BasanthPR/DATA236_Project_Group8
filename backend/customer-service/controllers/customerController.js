import Customer from '../models/customer.js';

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (req, res) => {
  try {
    // Fields that cannot be updated
    const restrictedFields = ['email', 'customerId'];
    const updates = Object.keys(req.body)
      .filter(key => !restrictedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const customer = await Customer.findOneAndUpdate(
      { customerId: req.user.customerId },
      { $set: updates },
      { 
        new: true,
        runValidators: true,
        select: '-creditCard.last4Digits' // Exclude sensitive data
      }
    );

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { customer }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
