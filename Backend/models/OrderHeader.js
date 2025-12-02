import mongoose from "mongoose";

const OrderHeaderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderDate: { type: Date, default: Date.now },
    orderTotal: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    sessionId: { type: String },
    chargeId: { type: String },
  },
  { timestamps: true }
);

const OrderHeaderModel = mongoose.model("OrderHeader", OrderHeaderSchema);
export default OrderHeaderModel;
