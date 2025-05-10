// import { v4 as uuidv4 } from 'uuid'; // Use UUID for generating unique IDs
// import Customer from '../models/customer.js';

// // Function to generate SSN format customer ID
// const generateCustomerId = () => {
//   const n1 = Math.floor(Math.random() * 900) + 100; // 3 digits (100-999)
//   const n2 = Math.floor(Math.random() * 90) + 10;   // 2 digits (10-99)
//   const n3 = Math.floor(Math.random() * 9000) + 1000; // 4 digits (1000-9999)
//   return `${n1}-${n2}-${n3}`;
// };

// // Get customer details with auto-creation for new users
// export const getCustomer = async (req, res) => {
//   const userId = req.user.id;
//   const userEmail = req.user.email;

//   if (!userId || !userEmail) {
//     return res.status(400).json({ message: 'Invalid user data' });
//   }

//   try {
//     console.log(`Looking for customer profile for: ${userEmail}`);
//     let customer = await Customer.findOne({
//       $or: [{ email: userEmail }, { userId: userId }],
//     });

//     if (!customer) {
//       console.log(`No customer profile found. Auto-creating for: ${userEmail}`);
//       const newCustomer = new Customer({
//         userId,
//         email: userEmail,
//         customerId: generateCustomerId(),
//         firstName: req.user.firstName || '',
//         lastName: req.user.lastName || '',
//         ssn: generateCustomerId(), // Generate a unique value for ssn
//         rating: 0,
//         ridesHistory: [],
//         reviews: [],
//       });

//       try {
//         customer = await newCustomer.save();
//         console.log(`Auto-created customer profile with ID: ${customer.customerId}`);
//         return res.status(200).json({ ...customer.toObject(), isNewProfile: true });
//       } catch (err) {
//         if (err.code === 11000) {
//           console.error('Duplicate key error:', err.message);
//           return res.status(409).json({ message: 'Duplicate key error', error: err.message });
//         }
//         throw err;
//       }
//     }

//     console.log(`Found existing customer profile for: ${userEmail}`);
//     return res.status(200).json(customer);
//   } catch (err) {
//     console.error('❌ Get customer error:', err.message);
//     return res.status(500).json({ message: 'Failed to get customer', error: err.message });
//   }
// };

// // Update customer profile
// export const updateCustomer = async (req, res) => {
//   const userId = req.user.id;
//   const userEmail = req.user.email;
//   const updates = { ...req.body };
  
//   try {
//     console.log(`Updating customer profile for: ${userEmail}`);
    
//     // Remove fields that shouldn't be changed
//     delete updates.email;
//     delete updates.userId;
//     delete updates.customerId;
    
//     // If SSN is provided but empty, set to undefined
//     if (updates.ssn === '') {
//       updates.ssn = undefined;
//     }
    
//     // Find customer profile
//     let customer = await Customer.findOne({ 
//       $or: [{ email: userEmail }, { userId: userId }]
//     });
    
//     if (!customer) {
//       console.log(`No customer profile found. Creating new profile for: ${userEmail}`);
      
//       // Create new customer with auto-generated ID
//       customer = new Customer({
//         userId,
//         email: userEmail,
//         customerId: generateCustomerId(),
//         firstName: req.user.firstName || updates.firstName || '',
//         lastName: req.user.lastName || updates.lastName || '',
//         ssn: undefined, // Explicitly set to undefined to avoid indexing issues
//         ...updates,
//         rating: 0,
//         ridesHistory: [],
//         reviews: []
//       });
      
//       await customer.save();
//       console.log(`Created customer profile with ID: ${customer.customerId}`);
      
//       return res.status(201).json(customer);
//     }
    
//     // Apply updates to existing customer
//     Object.keys(updates).forEach(key => {
//       if (updates[key] !== undefined) {
//         customer[key] = updates[key];
//       }
//     });
    
//     // Save changes
//     await customer.save();
//     console.log(`Updated customer profile with ID: ${customer.customerId}`);
    
//     return res.status(200).json(customer);
//   } catch (err) {
//     console.error('❌ Update customer error:', err.message);
//     return res.status(500).json({ message: 'Failed to update customer', error: err.message });
//   }
// };

// // Create customer profile manually
// export const createCustomer = async (req, res) => {
//   const userId = req.user.id;
//   const userEmail = req.user.email;
  
//   try {
//     console.log(`Creating customer profile for: ${userEmail}`);
    
//     // Check if profile already exists
//     const existingCustomer = await Customer.findOne({ 
//       $or: [{ email: userEmail }, { userId: userId }]
//     });
    
//     if (existingCustomer) {
//       console.log(`Customer profile already exists with ID: ${existingCustomer.customerId}`);
//       return res.status(400).json({ 
//         message: 'Customer profile already exists',
//         customerId: existingCustomer.customerId
//       });
//     }
    
//     // Create new customer with explicit null SSN if not provided
//     const customer = new Customer({
//       userId,
//       email: userEmail,
//       customerId: generateCustomerId(),
//       firstName: req.body.firstName || req.user.firstName || '',
//       lastName: req.body.lastName || req.user.lastName || '',
//       ssn: req.body.ssn || undefined, // Explicitly set to undefined if not provided
//       address: req.body.address || '',
//       city: req.body.city || '',
//       state: req.body.state || '',
//       zipCode: req.body.zipCode || '',
//       phoneNumber: req.body.phoneNumber || '',
//       rating: 0,
//       ridesHistory: [],
//       reviews: []
//     });
    
//     await customer.save();
//     console.log(`Created customer profile with ID: ${customer.customerId}`);
    
//     return res.status(201).json(customer);
//   } catch (err) {
//     console.error('❌ Create customer error:', err.message);
//     return res.status(500).json({ message: 'Failed to create customer', error: err.message });
//   }
// };

import { v4 as uuidv4 } from 'uuid'; // Use UUID for generating unique IDs
import redisClient from '../../shared/redis/redisClient.js'; // Import Redis client
import Customer from '../models/customer.js';

// Function to generate SSN format customer ID
const generateCustomerId = () => {
  const n1 = Math.floor(Math.random() * 900) + 100; // 3 digits (100-999)
  const n2 = Math.floor(Math.random() * 90) + 10;   // 2 digits (10-99)
  const n3 = Math.floor(Math.random() * 9000) + 1000; // 4 digits (1000-9999)
  return `${n1}-${n2}-${n3}`;
};

// Get customer details with auto-creation for new users
export const getCustomer = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!userId || !userEmail) {
    return res.status(400).json({ message: 'Invalid user data' });
  }

  try {
    console.log(`Looking for customer profile for: ${userEmail}`);

    // 1) Check Redis cache
    const cacheKey = `customer:${userId}`;
    const cachedCustomer = await redisClient.get(cacheKey);

    if (cachedCustomer) {
      console.log(`✅ Cache hit for customer: ${userEmail}`);
      return res.status(200).json(JSON.parse(cachedCustomer));
    }

    // 2) Cache miss → Query database
    console.log(`❌ Cache miss for customer: ${userEmail}, querying database...`);
    let customer = await Customer.findOne({
      $or: [{ email: userEmail }, { userId: userId }],
    });

    if (!customer) {
      console.log(`No customer profile found. Auto-creating for: ${userEmail}`);
      const newCustomer = new Customer({
        userId,
        email: userEmail,
        customerId: generateCustomerId(),
        firstName: req.user.firstName || '',
        lastName: req.user.lastName || '',
        ssn: generateCustomerId(), // Generate a unique value for ssn
        rating: 0,
        ridesHistory: [],
        reviews: [],
      });

      try {
        customer = await newCustomer.save();
        console.log(`Auto-created customer profile with ID: ${customer.customerId}`);
      } catch (err) {
        if (err.code === 11000) {
          console.error('Duplicate key error:', err.message);
          return res.status(409).json({ message: 'Duplicate key error', error: err.message });
        }
        throw err;
      }
    }

    // 3) Cache the result in Redis
    console.log(`💾 Caching customer profile for: ${userEmail}`);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(customer)); // Cache for 1 hour

    return res.status(200).json(customer);
  } catch (err) {
    console.error('❌ Get customer error:', err.message);
    return res.status(500).json({ message: 'Failed to get customer', error: err.message });
  }
};

// Update customer profile
export const updateCustomer = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const updates = { ...req.body };

  try {
    console.log(`Updating customer profile for: ${userEmail}`);

    // Remove fields that shouldn't be changed
    delete updates.email;
    delete updates.userId;
    delete updates.customerId;

    // If SSN is provided but empty, set to undefined
    if (updates.ssn === '') {
      updates.ssn = undefined;
    }

    // Find customer profile
    let customer = await Customer.findOne({
      $or: [{ email: userEmail }, { userId: userId }],
    });

    if (!customer) {
      console.log(`No customer profile found. Creating new profile for: ${userEmail}`);
      customer = new Customer({
        userId,
        email: userEmail,
        customerId: generateCustomerId(),
        firstName: req.user.firstName || updates.firstName || '',
        lastName: req.user.lastName || updates.lastName || '',
        ssn: undefined, // Explicitly set to undefined to avoid indexing issues
        ...updates,
        rating: 0,
        ridesHistory: [],
        reviews: [],
      });

      await customer.save();
      console.log(`Created customer profile with ID: ${customer.customerId}`);
    } else {
      // Apply updates to existing customer
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          customer[key] = updates[key];
        }
      });

      // Save changes
      await customer.save();
      console.log(`Updated customer profile with ID: ${customer.customerId}`);
    }

    // Invalidate the cache
    const cacheKey = `customer:${userId}`;
    await redisClient.del(cacheKey);
    console.log(`🗑 Cache invalidated for customer: ${userEmail}`);

    return res.status(200).json(customer);
  } catch (err) {
    console.error('❌ Update customer error:', err.message);
    return res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
};