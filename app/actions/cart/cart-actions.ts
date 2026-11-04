"use server";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function addToCartAction(productId: string) {
  const session = await auth();

  if (!session || !session?.user) {
    return { error: "Unauthorized: You must be logged in." };
  }

  await connectDB();

  const product = await Product.findById(productId);

  if (!product) {
    return { error: "Product not found" };
  }

  if (product.stock <= 0) {
    return { error: "Out of stock" };
  }

  const cart = await Cart.findOne({ user: session.user.id });

  if (!cart) {
    await Cart.create({
      user: session.user.id,
      items: [{ product: product._id, quantity: 1 }],
    });

    return { success: true, message: "Cart created successfully" };
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product._id.toString(),
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    if (newQuantity > product.stock) {
      return { error: `Only ${product.stock} available` };
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ product: product._id, quantity: 1 });
  }

  await cart.save();

  return { success: true };
}
