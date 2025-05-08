import Billing from "../models/billing.js";
import { Types, isValidObjectId } from "mongoose";
import axios from 'axios';
import { publish } from '../utils/kafkaClient.js';
import redisClient from "../../shared/redis/redisClient.js";

const FARE_URL = process.env.FARE_PREDICTOR_URL 
  || "http://localhost:8000/predict_fare/";

// Create Bill
const createBill = async (req, res) => {
  try {
    const billingId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const {
      pickup_latitude,
      pickup_longitude,
      dropoff_latitude,
      dropoff_longitude,
      passenger_count,
      pickup_datetime
    } = req.body;

    const mlRes = await axios.post(FARE_URL, {
      pickup_latitude,
      pickup_longitude,
      dropoff_latitude,
      dropoff_longitude,
      passenger_count,
      pickup_datetime
    });
    const predictedFare = mlRes.data.predicted_fare;

    const newBill = new Billing({
      date: new Date(req.body.date),
      pickupTime:    new Date(req.body.pickupTime),
      dropOffTime:   new Date(req.body.dropOffTime),
      distanceCovered: req.body.distanceCovered,
      sourceLocation: req.body.sourceLocation,
      destinationLocation: req.body.destinationLocation,
      billingId,
      totalAmount: predictedFare,
      customerId: new Types.ObjectId(req.body.customerId),
      driverId: new Types.ObjectId(req.body.driverId),
      rideId: new Types.ObjectId(req.body.rideId)
    });
    
    await newBill.save();
    await publish("billing.created", {
      billingId:   newBill.billingId,
      rideId:      newBill.rideId,
      customerId:  newBill.customerId,
      driverId:    newBill.driverId,
      totalAmount: newBill.totalAmount,
      createdAt:   newBill.createdAt
    });


    const billKey = `bill:${newBill.billingId}`;
    await redisClient.del(billKey);
    console.log("🗑 [Cache] evicted", billKey);
    const searchKeys = await redisClient.keys("searchBills:*");
    if (searchKeys.length > 0) {
      await redisClient.del(...searchKeys);
      console.log("🗑 [Cache] evicted search caches:", searchKeys);
    }

    res.status(201).json({
      billingId,
      predictedFare,
      status: "created",
      message: "Billing record created",
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get Bill By billingId
// const getBillById = async (req, res) => {
//   try {
//     const bill = await Billing.findOne({ billingId: req.params.billingId });
//     if (!bill) return res.status(404).json({ message: "Bill not found" });
//     res.status(200).json(bill);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const getBillById = async (req, res) => {
  const key = `bill:${req.params.billingId}`;

  try {
    // 1) Check cache
    const cached = await redisClient.get(key);
    if (cached) {
      console.log("🔁 [Cache] hit for", key);
      return res.status(200).json(JSON.parse(cached));
    }

    // 2) Miss → load from Mongo
    const bill = await Billing.findOne({ billingId: req.params.billingId });
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // 3) Store in Redis for 60s
    await redisClient.setEx(key, 60, JSON.stringify(bill));

    console.log("💾 [Cache] miss — caching", key);
    return res.status(200).json(bill);

  } catch (err) {
    console.error("Error in getBillById:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Delete Bill
const deleteBill = async (req, res) => {
  try {
    const deleted = await Billing.findOneAndDelete({ billingId: req.params.billingId });
    if (!deleted) return res.status(404).json({ message: "Bill not found" });

    const billKey = `bill:${req.params.billingId}`;
    await redisClient.del(billKey);
    console.log("🗑 [Cache] evicted", billKey);

    const searchKeys = await redisClient.keys("searchBills:*");
    if (searchKeys.length > 0) {
      await redisClient.del(...searchKeys);
      console.log("🗑 [Cache] evicted search caches:", searchKeys);
    }

    res.status(200).json({
      status: "success",
      message: "Bill deleted successfully",
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Bills with optional filters
const searchBills = async (req, res) => {
  try {
    const cacheKey = `searchBills:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("🔁 [Cache] hit for", cacheKey);
      return res.status(200).json(JSON.parse(cached));
    }
    const {
      startDate,
      endDate,
      minAmount,
      maxAmount,
      q,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = [];

    // Date range filter
    if (startDate || endDate) {
      const dateRange = {};
      if (startDate) dateRange.$gte = new Date(startDate);
      if (endDate) {
        const to = new Date(endDate);
        to.setDate(to.getDate() + 1);  // Include entire end date
        dateRange.$lt = to;
      }
      filters.push({ createdAt: dateRange });
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      const amountRange = {};
      if (minAmount) amountRange.$gte = parseFloat(minAmount);
      if (maxAmount) amountRange.$lte = parseFloat(maxAmount);
      filters.push({ totalAmount: amountRange });
    }

    // General search (by billingId, _id, rideId, customerId, driverId)
    if (q) {
      const orFilters = [{ billingId: { $regex: q, $options: "i" } }];
      if (isValidObjectId(q)) {
        orFilters.push({ _id: new Types.ObjectId(q) });
        orFilters.push({ rideId: new Types.ObjectId(q) });
        orFilters.push({ customerId: new Types.ObjectId(q) });
        orFilters.push({ driverId: new Types.ObjectId(q) });
      }
      filters.push({ $or: orFilters });
    }

    const query = filters.length ? { $and: filters } : {};

    const totalResults = await Billing.countDocuments(query);
    const bills = await Billing.find(query)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    
    const payload = {
      totalResults,
      page: parseInt(page),
      limit: parseInt(limit),
      bills,
    };
    await redisClient.setEx(cacheKey, 60, JSON.stringify(payload));
    console.log("💾 [Cache] miss — caching", cacheKey);

    res.status(200).json({
      totalResults,
      page: parseInt(page),
      limit: parseInt(limit),
      bills,
    });
  } catch (err) {
    console.error("Search Bills Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search Bills by Customer ID
const searchBillsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!isValidObjectId(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const bills = await Billing.find({ customerId: new Types.ObjectId(customerId) }).lean();

    if (!bills.length) {
      return res.status(404).json({ message: "No bills found for this customer" });
    }

    res.status(200).json({
      customerId,
      totalResults: bills.length,
      bills,
    });
  } catch (err) {
    console.error("Error searching bills by customerId:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Search Bills by Driver ID
const searchBillsByDriverId = async (req, res) => {
  try {
    const { driverId } = req.params;
    if (!isValidObjectId(driverId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }
    const bills = await Billing.find({ driverId }).lean();
    if (!bills.length) {
      return res.status(404).json({ message: "No bills found for this driver" });
    }
    return res.status(200).json({
      driverId,
      totalResults: bills.length,
      bills,
    });
  } catch (err) {
    console.error("Error searching bills by driverId:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search Bills by Ride ID
const searchBillsByRideId = async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!isValidObjectId(rideId)) {
      return res.status(400).json({ message: "Invalid ride ID" });
    }
    const bills = await Billing.find({ rideId }).lean();
    if (!bills.length) {
      return res.status(404).json({ message: "No bills found for this ride" });
    }
    return res.status(200).json({
      rideId,
      totalResults: bills.length,
      bills,
    });
  } catch (err) {
    console.error("Error searching bills by rideId:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Export only real billing logic — no predictFare here
export {
  createBill,
  getBillById,
  deleteBill,
  searchBills,
  searchBillsByCustomerId,
  searchBillsByDriverId,
  searchBillsByRideId
};
