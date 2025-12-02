// server/controllers/replacementController.js
import OrderHeaderModel from "../models/OrderHeader.js";
import OrderDetailsModel from "../models/OrderDetails.js";
import ReplacementModel from "../models/Replacement.js";

// ------------------
// Get all orders for a user
// ------------------
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await OrderHeaderModel.find({ user: userId })
      .sort({ orderDate: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch items for all orders
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDetailsModel.find({ orderHeader: order._id })
          .populate("product", "name price department")
          .lean();
        return { ...order, items };
      })
    );

    return res.status(200).json(ordersWithItems);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------
// 1. Get order with items and replacements
// ------------------
export const getOrderWithItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderHeaderModel.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = await OrderDetailsModel.find({ orderHeader: orderId })
      .populate("product", "name price department")
      .populate({ path: "product", populate: { path: "department", select: "_id name" } })
      .lean();

    const replacements = await ReplacementModel.find({ order: orderId })
      .populate({ path: "product", select: "name price department", populate: { path: "department", select: "_id name" } })
      .populate("newProduct", "name price")
      .lean();

    return res.status(200).json({ order, items, replacements });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------
// 2. Request replacement
// ------------------
// ------------------
// Request replacement (auto-approved)
// ------------------
// Request replacement (auto-approved)
// ------------------
export const requestReplacement = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;
    if (!orderId || !productId || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await OrderHeaderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const orderItem = await OrderDetailsModel.findOne({
      orderHeader: orderId,
      product: productId,
    });
    if (!orderItem)
      return res.status(400).json({ message: "Product not found in this order" });

    // Create replacement and auto-approve (status = Pending, selection of new product required)
    const replacement = new ReplacementModel({
      order: orderId,
      product: productId,
      reason,
      status: "Pending", // will complete once new product selected
    });

    await replacement.save();
    return res.status(201).json({ message: "Replacement requested", replacement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------
// Select new product (auto-complete replacement)
// ------------------
export const selectNewProduct = async (req, res) => {
  try {
    const { replacementId } = req.params;
    const { newProductId } = req.body;

    if (!newProductId) return res.status(400).json({ message: "New product ID required" });

    const replacement = await ReplacementModel.findById(replacementId);
    if (!replacement) return res.status(404).json({ message: "Replacement not found" });

    const orderId = replacement.order;
    const oldProductId = replacement.product;

    // Update replacement record
    replacement.newProduct = newProductId;
    replacement.status = "Completed";
    await replacement.save();

    // Replace old product in the same order
    const orderItem = await OrderDetailsModel.findOne({ orderHeader: orderId, product: oldProductId });
    if (orderItem) {
      orderItem.product = newProductId;
      // Optional: update price if needed
      await orderItem.save();
    }

    // Optional: recalc total amount
    const items = await OrderDetailsModel.find({ orderHeader: orderId });
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await OrderHeaderModel.findByIdAndUpdate(orderId, { totalAmount: newTotal });

    return res.status(200).json({
      message: "Replacement completed and order updated with new product",
      replacement,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};



