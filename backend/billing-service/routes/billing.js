import express from "express";
import {
  createBill,
  getBillById,
  deleteBill,
  searchBills,
  predictFare
} from "../controllers/billingController.js";
import { authenticateToken, authorizeRoles } from '../../shared/auth/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /search
 * @desc    Search/filter/paginate bills
 * @access  Protected
 */
router.get("/search", authenticateToken, searchBills);

/**
 * @route   POST /create
 * @desc    Create a billing record
 * @access  Protected (admin, driver, customer)
 */
router.post("/create", authenticateToken, authorizeRoles("admin", "driver", "customer"), createBill);

/**
 * @route   GET /:billingId
 * @desc    Get bill by billing ID
 * @access  Protected
 */
router.get("/:billingId", authenticateToken, getBillById);

/**
 * @route   DELETE /:billingId
 * @desc    Delete a bill
 * @access  Protected (admin, customer)
 */
router.delete("/:billingId", authenticateToken, authorizeRoles("admin", "customer"), deleteBill);

/**
 * @route   POST /predict-fare
 * @desc    Predict fare using FastAPI model
 * @access  Protected
 */
router.post("/predict-fare", authenticateToken, predictFare);

export default router;
