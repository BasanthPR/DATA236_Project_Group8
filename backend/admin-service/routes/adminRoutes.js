import express from "express";
import {
  authenticateToken,
  authorizeRoles
} from "../../shared/auth/authMiddleware.js"; // ✅ Updated path to shared middleware

import {
  addDriver,
  addCustomer,
  getUser,
  getRevenueByDay,
  getRidesPerArea,
  getRidesPerDriver,
  getRidesPerCustomer,
  searchBills,
  getBillById
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Protect all routes with authentication and admin-only access
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// 👤 Admin management
router.post("/drivers", addDriver);
router.post("/customers", addCustomer);
router.get("/users/:userId", getUser);

// 📊 Stats
router.get("/stats/revenue", getRevenueByDay);
router.get("/stats/rides-per-area", getRidesPerArea);
router.get("/charts/rides-per-driver", getRidesPerDriver);
router.get("/charts/rides-per-customer", getRidesPerCustomer);

// 💳 Billing
router.get("/bills/search", searchBills);
router.get("/bills/:billId", getBillById);

export default router;
