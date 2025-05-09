// controllers/driverController.js
import Driver from "../models/driver.js";

// Create driver details from logged in user
export const createDriver = async (req, res) => {
  const userEmail = req.user.email;
  const { 
    driverId,
    licenseNumber, 
    firstName, 
    lastName,
    phoneNumber,
    address,
    city,
    state,
    zipCode,
    carDetails,
    location 
  } = req.body;

  try {
    // Prevent duplicate profile
    if (await Driver.findOne({ email: userEmail })) {
      return res.status(400).json({ message: 'Driver profile already exists' });
    }

    const driver = new Driver({
      email: userEmail,
      driverId,
      licenseNumber,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      carDetails,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      // imageUrl & videoUrl default to '' per schema
      isAvailable: false,
      rating: 0,
      ridesCompleted: 0,
      reviews: []
    });

    await driver.save();
    return res.status(201).json({
      status: 'success',
      data: { driver }
    });

  } catch (err) {
    console.error('❌ Create driver error:', err.message);
    return res.status(500).json({ 
      message: 'Failed to create driver profile', 
      error: err.message 
    });
  }
};

// Get driver profile
export const getDriverProfile = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const driver = await Driver.findOne({ email: userEmail })
      .select('-__v');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: { driver }
    });

  } catch (err) {
    console.error('❌ Get driver error:', err.message);
    return res.status(500).json({ 
      message: 'Failed to fetch driver profile', 
      error: err.message 
    });
  }
};

// Get nearby drivers
export const getNearbyDrivers = async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query; // meters

  try {
    const nearbyDrivers = await Driver.find({
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude)
            ]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
    .select('firstName lastName carDetails location rating imageUrl videoUrl');

    return res.status(200).json({
      status: 'success',
      results: nearbyDrivers.length,
      data: { drivers: nearbyDrivers }
    });

  } catch (err) {
    console.error('❌ Get nearby drivers error:', err.message);
    return res.status(500).json({ 
      message: 'Failed to fetch nearby drivers', 
      error: err.message 
    });
  }
};

// Update driver location
export const updateDriverLocation = async (req, res) => {
  const userEmail = req.user.email;
  const { latitude, longitude } = req.body;

  try {
    const driver = await Driver.findOneAndUpdate(
      { email: userEmail },
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    ).select('-__v');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: { driver }
    });

  } catch (err) {
    console.error('❌ Update location error:', err.message);
    return res.status(500).json({ 
      message: 'Failed to update location', 
      error: err.message 
    });
  }
};

/**
 * PATCH /api/drivers/media
 * Upload or replace the driver’s photo and/or video.
 * Expects multipart/form-data with fields:
 *    - image (single file)
 *    - video (single file)
 */
export const updateDriverMedia = async (req, res) => {
  const userEmail = req.user.email;
  const files = req.files || {};
  console.log('💡 [updateDriverMedia] userEmail:', userEmail);
  console.log('💡 [updateDriverMedia] req.files:', req.files);

  // Build dynamic update payload
  const update = {};
  if (files.image?.length) {
    update.imageUrl = files.image[0].path;
  }
  if (files.video?.length) {
    update.videoUrl = files.video[0].path;
  }

  if (!Object.keys(update).length) {
    return res.status(400).json({
      message: 'No image or video file provided'
    });
  }

  try {
    const driver = await Driver.findOneAndUpdate(
      { email: userEmail },
      { $set: update },
      { new: true }
    ).select('-__v');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: { driver }
    });

  } catch (err) {
    console.error('❌ Update driver media error:', err);
    return res.status(500).json({
      message: 'Failed to update driver media',
      error: err.message
    });
  }
};
