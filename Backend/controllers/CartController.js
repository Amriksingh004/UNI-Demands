import OrderDetailsModel from "../models/OrderDetails.js";
import OrderHeaderModel from "../models/OrderHeader.js";
import ShoppingCartModel from "../models/ShoppingCart.js";
import UserModel from "../models/User.js";
import { createCheckoutSession } from "../services/paymentService.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import stripe from "stripe";
import dotenv from "dotenv";
import createMessage from "../services/twilioSmsService.js";

dotenv.config();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

export const GetCartItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const cart = await ShoppingCartModel.find({
      user: req.user.id,
    }).populate("product");

    let total = cart.reduce((sum, item) => {
      if (item.product) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    res.status(200).send({ cart, total });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).send(error);
  }
};

export const AddToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const prodExist = await ShoppingCartModel.findOne({
      user: req.user.id,
      product: req.body.productId,
    });
    if (prodExist) {
      const cart = await ShoppingCartModel.findOneAndUpdate(
        { user: req.user.id, product: req.body.productId },
        {
          quantity: prodExist.quantity + Number(req.body.quantity),
        }
      );
    } else {
      const cart = await ShoppingCartModel.create({
        user: req.user.id,
        product: req.body.productId,
        quantity: req.body.quantity,
      });
    }
    res.status(201).send("Added to cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send(error);
  }
};

export const incProdCount = async (req, res) => {
  try {
    const cart = await ShoppingCartModel.findByIdAndUpdate(
      req.body.cartId,
      { $inc: { quantity: 1 } },
      { new: true }
    );
    res.status(200).send(cart);
  } catch (error) {
    console.error("Error incrementing product count:", error);
    res.status(500).send(error);
  }
};

export const decProdCount = async (req, res) => {
  try {
    const cart = await ShoppingCartModel.findOneAndUpdate(
      { _id: req.body.cartId, quantity: { $gt: 1 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );
    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const deleteProd = async (req, res) => {
  try {
    const cart = await ShoppingCartModel.findByIdAndDelete(req.body.cartId);
    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const OrderSummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const cartItems = await ShoppingCartModel.find({
      user: req.user.id,
    }).populate("product");

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.status(200).send({ cartItems, total });
  } catch (error) {
    console.error("Error getting order summary:", error);
    res.status(500).send(error);
  }
};

export const OrderSubmission = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const cart = await ShoppingCartModel.find({
      user: req.user.id,
    }).populate("product");

    // Filter out items where the product has been deleted
    const validCart = cart.filter(item => item.product);

    if (validCart.length === 0) {
      return res.status(400).send({ message: "Your cart is empty or contains only unavailable items." });
    }

    let orderTotal = 0;

    // Use the filtered cart
    validCart.forEach((item) => {
      orderTotal += item.product.price * item.quantity;
    });

    const order = await OrderHeaderModel.create({
      user: req.user.id,
      orderDate: new Date(),
      orderTotal: orderTotal,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      fullName: req.body.fullName,
      address: req.body.address,
      phone: req.body.phone,
    });

    // Use the filtered cart
    for (const item of validCart) {
      await OrderDetailsModel.create({
        orderHeader: order._id,
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    const session = await createCheckoutSession(
      // Use the filtered cart
      validCart,
      orderTotal,
      req.body.successUrl,
      req.body.cancelUrl
    );

    await OrderHeaderModel.findByIdAndUpdate(order._id, {
      sessionId: session.id,
    });

    res.status(200).send({ sessionId: session.id });
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).send(error);
  }
};

export const GetCheckout = async (req, res) => {
  try {
    const order = await OrderHeaderModel.findById(req.params.orderId);
    res.render("checkout", {
      title: "Checkout",
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      sessionId: order.sessionId,
    });
  } catch (error) {
    console.error("Error getting checkout:", error);
    res.status(500).send(error);
  }
};  

export const OrderConfirmation = async (req, res) => {
  try {
    const orderHeader = await OrderHeaderModel.findOne({
      sessionId: req.query.session_id,
    }).populate("user");

    if (orderHeader) {
      const session = await stripeClient.checkout.sessions.retrieve(
        req.query.session_id
      );
      if (session.payment_status === "paid") {
        await OrderHeaderModel.findByIdAndUpdate(orderHeader._id, {
          paymentStatus: "Paid",
          orderStatus: "Confirmed",
          chargeId: session.payment_intent,
        });

        await sendOrderConfirmationEmail(orderHeader.user.email, {
          orderId: orderHeader._id,
          orderTotal: orderHeader.orderTotal,
        });

        await createMessage(
          orderHeader._id,
          orderHeader.orderTotal,
          orderHeader.user.phone
        );

        await ShoppingCartModel.deleteMany({ user: orderHeader.user._id });

        res
          .status(200)
          .send({ message: "Order Confirmed", orderId: orderHeader._id });
      } else {
        res.status(400).send({ message: "Payment not successful." });
      }
    } else {
      res.status(404).send({ message: "Order not found." });
    }
  } catch (error) {
    console.error("Error in order confirmation:", error);
    res.status(500).send(error);
  }
};




// export const orderConfirmation = async (req, res) => {
//   const sessionId = req.query.session_id;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     const customerEmail = session.customer_details.email;
//     const orderId = session.metadata.order_id;
//     const orderTotal = session.amount_total / 100;

//     // ✅ Send email
//     await sendOrderConfirmationEmail(customerEmail, {
//       orderId,
//       orderTotal
//     });

//     res.status(200).json({ message: 'Order confirmed and email sent.' });

//   } catch (error) {
//     console.error('❌ Error confirming order:', error);
//     res.status(500).json({ message: 'Failed to confirm order' });
//   }
// };
