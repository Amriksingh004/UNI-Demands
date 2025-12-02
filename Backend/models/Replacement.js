// server/models/Replacement.js
import mongoose from "mongoose";

const ReplacementSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "OrderHeader", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    newProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Replacement", ReplacementSchema);
