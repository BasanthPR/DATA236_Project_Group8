import Driver from "../models/driver.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Register new driver
const signupDriver = async (req, res) => {
  try {
    const { driverId, firstName, lastName, email, password } = req.body;
    if (!driverId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (await Driver.findOne({ $or: [{ email }, { driverId }] })) {
      return res.status(400).json({ message: "Email or Driver ID already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const driver = new Driver({ ...req.body, password: hashedPassword });
    await driver.save();
    const token = jwt.sign({ id: driver._id, role: "driver" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ message: "Driver registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login driver
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: driver._id, role: "driver" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create driver (admin)
const createDriver = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const driverData = { ...req.body, password: hashedPassword };
    const driver = new Driver(driverData);
    await driver.save();
    res.status(201).json({ message: "Driver created successfully", id: driver._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all drivers
const listDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password").lean();
    res.json({ results: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver profile
const getDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId) ? { _id: driverId } : { driverId };
    const driver = await Driver.findOne(filter).select("-password").lean();
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (req.user.role === "driver" && req.user.id !== driver._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId) ? { _id: driverId } : { driverId };
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updated = await Driver.findOneAndUpdate(filter, req.body, { new: true }).select("-password").lean();
    if (!updated) return res.status(404).json({ message: "Driver not found" });
    if (req.user.role === "driver" && req.user.id !== updated._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json({ message: "Driver updated successfully", driver: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId) ? { _id: driverId } : { driverId };
    const driver = await Driver.findOne(filter);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    await driver.remove();
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search drivers
const searchDrivers = async (req, res) => {
  try {
    const { firstName, lastName, city, state, rating, driverId } = req.query;
    const filters = {};
    if (firstName) filters.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) filters.lastName = { $regex: lastName, $options: 'i' };
    if (city) filters.city = { $regex: city, $options: 'i' };
    if (state) filters.state = { $regex: state, $options: 'i' };
    if (driverId) filters.driverId = driverId;
    if (rating) filters.rating = Number(rating);
    const drivers = await Driver.find(filters).select("-password").lean();
    res.json({ results: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get introduction media
const getIntroduction = async (req, res) => {
  try {
    const { driverId } = req.params;
    const filter = Types.ObjectId.isValid(driverId) ? { _id: driverId } : { driverId };
    const driver = await Driver.findOne(filter).select("introductionImages introductionVideo").lean();
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ images: driver.introductionImages, video: driver.introductionVideo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  signupDriver,
  loginDriver,
  createDriver,
  listDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
  searchDrivers,
  getIntroduction
};