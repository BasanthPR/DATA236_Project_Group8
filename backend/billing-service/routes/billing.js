import express from "express";
import {
  createBill,
  getBillById,
  deleteBill,
  searchBillsByCustomerId,
  searchBillsByDriverId,
  searchBillsByRideId,
  searchBills
} from "../controllers/billingController.js"; // ✅ only billing logic

import { authenticateToken, authorizeRoles } from '../../shared/auth/authMiddleware.js';
import {
    createBillRules,
    searchBillsRules,
    billingIdParamRule,
    validate
  } from '../middleware/validators.js';
// import { predictFare } from "../controllers/predictFareController.js"; // ✅ FastAPI ML model only

const router = express.Router();

/**
 * @route   GET /search
 * @desc    Search/filter/paginate bills
 * @access  Protected
 */
router.get("/search", authenticateToken, searchBillsRules, validate, searchBills);


/**
 * @route   POST /create
 * @desc    Create a billing record
 * @access  Protected (admin, driver, customer)
 */
router.post("/create", authenticateToken, authorizeRoles("admin", "driver", "customer"), createBillRules, validate, createBill );

/**
 * @route   GET /:billingId
 * @desc    Get bill by billing ID
 * @access  Protected
 */
router.get("/:billingId", authenticateToken, billingIdParamRule,validate, getBillById);

/**
 * @route   DELETE /:billingId
 * @desc    Delete a bill
 * @access  Protected (admin, customer)
 */
router.delete("/:billingId", authenticateToken, authorizeRoles("admin", "customer"), billingIdParamRule, validate, deleteBill);

// /**
//  * @route   POST /predict-fare
//  * @desc    Predict fare using FastAPI ML model
//  * @access  Protected
//  */
// router.post("/predict-fare", authenticateToken, predictFare);

/**
+ * @route   GET /customer/:customerId
+ * @desc    Get all bills for a customer
+ * @access  Admin or that customer
+ */
router.get(
    "/customer/:customerId",
    authenticateToken,
    authorizeRoles("admin", "customer"),
    searchBillsByCustomerId,
    billingIdParamRule,
    validate
  );
  
  /**
  + * @route   GET /driver/:driverId
  + * @desc    Get all bills for a driver
  + * @access  Admin or that driver
  + */
  router.get(
    "/driver/:driverId",
    authenticateToken,
    authorizeRoles("admin", "driver"),
    searchBillsByDriverId,
    billingIdParamRule,
    validate
  );
  
  /**
  + * @route   GET /ride/:rideId
  + * @desc    Get all bills for a ride
  + * @access  Admin, customer, or driver
  + */
  router.get(
    "/ride/:rideId",
    authenticateToken,
    authorizeRoles("admin", "customer", "driver"),
    searchBillsByRideId,
    billingIdParamRule,
    validate
  );

export default router;
