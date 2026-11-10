"use server";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";

type PopulatedProduct = {
  _id: unknown;
  title: string;
  price: number; // dollars
  stock: number;
  imageUrl?: string;
} | null;

export async function createOrderAction() {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized: You must be logged in." };
  }

  await connectDB();

  const cart = await Cart.findOne({ user: session.user.id })
    .populate({ path: "items.product", model: Product })
    .lean();

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty" };
  }

  const orderItems = [];
  let totalCents = 0;

  for (const { product, quantity } of cart.items as {
    product: PopulatedProduct;
    quantity: number;
  }[]) {
    if (!product) {
      return {
        error: "Some items are no longer available. Please review your cart.",
      };
    }
    if (quantity > product.stock) {
      return { error: `Only ${product.stock} of "${product.title}" available` };
    }
    const priceCents = Math.round(product.price * 100);

    orderItems.push({
      product: product._id,
      title: product.title,
      imageUrl: product.imageUrl,
      priceCents,
      quantity,
    });
    totalCents += priceCents * quantity;
  }

  const order = await Order.create({
    user: session.user.id,
    items: orderItems,
    totalCents,
  });
  return { success: true, orderId: String(order._id) };
}
