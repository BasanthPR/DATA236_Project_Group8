// controllers/driverController.js
import Driver from "../models/driver.js";
import redisClient from "../../shared/redis/redisClient.js";

// Create driver details from logged in user
export const createDriver = async (req, res) => {
  const userEmail = req.user.email;
  const {
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

    // ── Generate a unique SSN-style driverId ──
    let driverId;
    do {
      driverId = [
        Math.floor(100 + Math.random() * 900),    // 3 digits
        Math.floor(10  + Math.random() *  90),    // 2 digits
        Math.floor(1000+ Math.random() * 9000)    // 4 digits
      ].join('-');
    } while (await Driver.findOne({ driverId }));

    const driver = new Driver({
      email:          userEmail,
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
      // schema defaults
      isAvailable:    false,
      rating:         0,
      ridesCompleted: 0,
      reviews:        []
    });

    await driver.save();
    // Invalidate cache
    await redisClient.del(`driver:${userEmail}`);

    

    // Emit driver.created
    await publish('driver.created', {
      driverId:  driver.driverId,
      email:     driver.email,
      name:      `${driver.firstName} ${driver.lastName}`,
      createdAt: driver.createdAt
    });

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

// Get driver profile (with Redis cache)
export const getDriverProfile = async (req, res) => {
  const userEmail = req.user.email;
  const cacheKey = `driver:${userEmail}`;

  try {
    // Try cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`🔁 [Cache] hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached));
    }

    // Cache miss → fetch from Mongo
    const driver = await Driver.findOne({ email: userEmail }).select('-__v');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const payload = { status: 'success', data: { driver } };

    // Store in cache for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(payload));
    console.log(`💾 [Cache] miss — caching ${cacheKey}`);

    return res.status(200).json(payload);
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
  const { latitude, longitude, radius = 5000 } = req.query;
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
  const cacheKey = `driver:${userEmail}`;

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

    // Invalidate cache
    await redisClient.del(cacheKey);

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
 */
export const updateDriverMedia = async (req, res) => {
  const userEmail = req.user.email;
  const files = req.files || {};
  const update = {};
  if (files.image?.length) update.imageUrl = files.image[0].path;
  if (files.video?.length) update.videoUrl = files.video[0].path;
  if (!Object.keys(update).length) {
    return res.status(400).json({ message: 'No image or video file provided' });
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

    // Invalidate cache
    await redisClient.del(`driver:${userEmail}`);

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

// Update driver profile fields (phone, address, carDetails, location)
export const updateDriverProfile = async (req, res) => {
  const userEmail = req.user.email;
  const files = req.files || {};
  const body  = req.body || {};
  const update = {};
  const cacheKey = `driver:${userEmail}`;

  // Profile fields
  ["phoneNumber","address","city","state","zipCode"].forEach(f => {
    if (body[f] != null) update[f] = body[f];
  });

  // Car details
  if (
    body["carDetails.make"] ||
    body["carDetails.model"] ||
    body["carDetails.year"] ||
    body["carDetails.plateNumber"]
  ) {
    update.carDetails = {
      make:        body["carDetails.make"]  || undefined,
      model:       body["carDetails.model"] || undefined,
      year:   Number(body["carDetails.year"]) || undefined,
      plateNumber: body["carDetails.plateNumber"] || undefined
    };
  }

  // Location
  if (body.latitude && body.longitude) {
    update.location = {
      type: "Point",
      coordinates: [
        Number(body.longitude),
        Number(body.latitude)
      ]
    };
  }

  // Media fields
  if (files.image?.length) update.imageUrl = files.image[0].path;
  if (files.video?.length) update.videoUrl = files.video[0].path;

  try {
    const driver = await Driver.findOneAndUpdate(
      { email: userEmail },
      { $set: update },
      { new: true }
    ).select("-__v");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Invalidate cache
    await redisClient.del(cacheKey);

   // Emit driver.updated
    await publish('driver.updated', {
      driverId:      driver.driverId,
      updatedFields: Object.keys(update),
      updatedAt:     new Date()
    });

 

    return res.status(200).json({
      status: "success",
      data: { driver }
    });
  } catch (err) {
    console.error("❌ Update driver profile error:", err);
    return res.status(500).json({
      message: "Failed to update driver profile",
      error: err.message
    });
  }
};
