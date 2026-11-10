import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    imageUrl: { type: String },
    priceCents: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [OrderItemSchema],
      validate: [
        (items: unknown[]) => items.length > 0,
        "An order needs at least one item",
      ],
    },
    totalCents: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
