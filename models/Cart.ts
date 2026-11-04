import mongoose, { Schema } from "mongoose";

const CartItemsSchema = new mongoose.Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
    unique: true,
  },
  items: {
    type: [CartItemsSchema],
    default: [],
  },
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
