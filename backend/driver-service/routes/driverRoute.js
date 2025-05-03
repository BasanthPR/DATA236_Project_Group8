// routes/driverRoute.js
import express from "express";
import { 
  createDriver, 
  getDriver, 
  updateDriver, 
  deleteDriver, 
  searchDrivers, 
  updateDriverLocation, 
  signup, 
  login, 
  getProfile, 
  updateProfile, 
  updateLocation 
} from "../controllers/driverController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.use(authenticateToken);
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/location", updateLocation);

// 1. POST    /api/drivers
router.post("/", createDriver);

// 5. GET     /api/drivers
router.get("/", searchDrivers);

// 2. GET     /api/drivers/:driverId
router.get("/:driverId", getDriver);

// 3. PATCH   /api/drivers/:driverId
router.patch("/:driverId", updateDriver);

// 6. PATCH   /api/drivers/:driverId/location
router.patch("/:driverId/location", updateDriverLocation);

// 4. DELETE  /api/drivers/:driverId
router.delete("/:driverId", deleteDriver);

export default router;
