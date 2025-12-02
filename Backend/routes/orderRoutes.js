// server/routes/orderRoutes.js
import express from "express";
import { getUserOrders, getOrderWithItems, requestReplacement, selectNewProduct } from "../controllers/ReplacementController.js";

const router = express.Router();

// Get all orders for a user
router.get("/user/:userId", getUserOrders);

// Get order with items + replacements
router.get("/:orderId", getOrderWithItems);

// Request replacement
router.post("/replacement/request", requestReplacement);

// Select new product for replacement
router.post("/replacement/:replacementId/select-new", selectNewProduct);

export default router;
