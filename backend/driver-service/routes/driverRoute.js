// routes/driverRoutes.js
import express from "express";
import {
  signupDriver,
  loginDriver,
  createDriver,
  listDrivers,
  getDriver,
  updateDriver,
  deleteDriver,
  searchDrivers,
  getIntroduction
} from "../controllers/driverController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signupDriver);
router.post("/login", loginDriver);

// Protected routes
router.use(authenticateToken);
router.post("/", authorizeRoles("admin"), createDriver);
router.get("/", authorizeRoles("admin"), listDrivers);
router.get("/:driverId", authorizeRoles("admin", "driver"), getDriver);
router.put("/:driverId", authorizeRoles("admin", "driver"), updateDriver);
router.delete("/:driverId", authorizeRoles("admin"), deleteDriver);
router.get("/search", authorizeRoles("admin"), searchDrivers);
router.get("/:driverId/introduction", authorizeRoles("admin", "driver"), getIntroduction);

export default router;