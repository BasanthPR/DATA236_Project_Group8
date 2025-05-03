import express from "express";
import Ride from "../models/ride.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const ride = await Ride.create(req.body);
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: "Failed to create ride" });
  }
});

export default router;
