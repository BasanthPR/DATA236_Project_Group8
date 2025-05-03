import User from '../models/user.js'; 
import Ride from "../models/ride.js";
import Bill from "../models/billing.js"; // ✅ now registered on the right Mongoose connection
import { Types } from "mongoose";

// Add a new driver
const addDriver = async (req, res) => {
  try {
    const newDriver = new User({ ...req.body, role: "driver" });
    await newDriver.save();
    res.status(201).json({ message: "Driver created", id: newDriver._id });
  } catch (err) {
    console.error("❌ Failed to create driver:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Add a new customer
const addCustomer = async (req, res) => {
  try {
    const newCustomer = new User({ ...req.body, role: "customer" });
    await newCustomer.save();
    res.status(201).json({ message: "Customer created", id: newCustomer._id });
  } catch (err) {
    console.error("❌ Failed to create customer:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID (driver or customer)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Failed to fetch user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get revenue for a specific day
const getRevenueByDay = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date query param is required" });

    const from = new Date(date);
    const to = new Date(from);
    to.setDate(from.getDate() + 1);

    const bills = await Bill.find({ createdAt: { $gte: from, $lt: to } }).lean();
    const totalRevenue = bills.reduce((acc, bill) => acc + (bill.totalAmount || 0), 0);

    res.json({ date, totalRevenue });
  } catch (err) {
    console.error("❌ Failed to fetch revenue:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get rides grouped by area
const getRidesPerArea = async (req, res) => {
  try {
    const result = await Ride.aggregate([
      { $group: { _id: "$area", totalRides: { $sum: 1 } } },
      { $project: { area: "$_id", totalRides: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch rides per area:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get ride counts per driver
const getRidesPerDriver = async (req, res) => {
  try {
    const result = await Ride.aggregate([
      { $group: { _id: "$driverId", totalRides: { $sum: 1 } } },
      { $project: { driverId: "$_id", totalRides: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch rides per driver:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get ride counts per customer
const getRidesPerCustomer = async (req, res) => {
  try {
    const result = await Ride.aggregate([
      { $group: { _id: "$customerId", totalRides: { $sum: 1 } } },
      { $project: { customerId: "$_id", totalRides: 1, _id: 0 } }
    ]);
    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch rides per customer:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Search bills with filters
const searchBills = async (req, res) => {
  try {
    const filters = {};
    const { customerId, driverId, billingId } = req.query;

    if (customerId && Types.ObjectId.isValid(customerId)) {
      filters.customerId = customerId;
    }

    if (driverId && Types.ObjectId.isValid(driverId)) {
      filters.driverId = driverId;
    }

    if (billingId) {
      filters.billingId = billingId;
    }

    const bills = await Bill.find(filters).lean();
    res.json({ results: bills.length, bills });
  } catch (err) {
    console.error("❌ Failed to search bills:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get a single bill by ID
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findOne({ billingId: req.params.billId }).lean();
    if (!bill) return res.status(404).json({ message: "Not found" });
    res.json(bill);
  } catch (err) {
    console.error("❌ Failed to fetch bill:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export {
  addDriver,
  addCustomer,
  getUser,
  getRevenueByDay,
  getRidesPerArea,
  getRidesPerDriver,
  getRidesPerCustomer,
  searchBills,
  getBillById
};