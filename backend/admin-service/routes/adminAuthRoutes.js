import express from "express";
import { signup, login } from "../controllers/adminAuthController.js";

const router = express.Router();

/**
 * @route   POST /api/admin/signup
 * @desc    Register a new admin
 * @access  Public
 */
router.post("/signup", signup);

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and get token
 * @access  Public
 */
router.post("/login", login);

export default router;
