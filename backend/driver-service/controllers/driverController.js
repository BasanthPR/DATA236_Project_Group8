// controllers/driverController.js
import Driver from "../models/driver.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Auth Controllers
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check existing driver
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create driver
    const driver = await Driver.create({
      ...req.body,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: driver._id, email: driver.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      status: 'success',
      token,
      data: {
        driver: {
          id: driver._id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check driver exists
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, driver.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: driver._id, email: driver.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: {
        driver: {
          id: driver._id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Controllers
export const getProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-password');
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ status: 'success', data: { driver } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: { driver: updatedDriver }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    ).select('location');

    res.status(200).json({
      status: 'success',
      data: { location: updatedDriver.location }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 1. Create Driver
export const createDriver = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
    const driver = await Driver.create(req.body);
    return res.status(201).json({ message: "Driver created", id: driver._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 2. Get Driver by ID
export const getDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId)
      ? { _id: driverId }
      : { driverId };
    const driver = await Driver.findOne(filter).select("-password").lean();
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    return res.status(200).json(driver);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 3. Update Driver (Partial)
export const updateDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId)
      ? { _id: driverId }
      : { driverId };
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updated = await Driver.findOneAndUpdate(
      filter,
      req.body,
      { new: true }
    ).select("-password").lean();
    if (!updated) return res.status(404).json({ message: "Driver not found" });
    return res.status(200).json({ message: "Updated", driver: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 4. Delete Driver
export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId)
      ? { _id: driverId }
      : { driverId };
    const driver = await Driver.findOne(filter);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    await driver.remove();
    // 204: No Content
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 5. List/Search Drivers
export const searchDrivers = async (req, res) => {
  try {
    const { city, state, zipCode, car_make, car_model, min_rating } = req.query;
    const filters = {};
    if (city)    filters.city = { $regex: city, $options: "i" };
    if (state)   filters.state = { $regex: state, $options: "i" };
    if (zipCode) filters.zipCode = zipCode;
    if (car_make)  filters["carDetails.make"] = { $regex: car_make, $options: "i" };
    if (car_model) filters["carDetails.model"] = { $regex: car_model, $options: "i" };
    if (min_rating) filters.rating = { $gte: Number(min_rating) };

    const drivers = await Driver.find(filters).select("-password").lean();
    return res.status(200).json({ results: drivers.length, drivers });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 6. Update Driver Location
export const updateDriverLocation = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "latitude & longitude required" });
    }
    const filter = Types.ObjectId.isValid(driverId)
      ? { _id: driverId }
      : { driverId };
    const updated = await Driver.findOneAndUpdate(
      filter,
      { location: { latitude, longitude } },
      { new: true }
    ).select("location").lean();
    if (!updated) return res.status(404).json({ message: "Driver not found" });
    return res.status(200).json({ message: "Location updated", location: updated.location });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
