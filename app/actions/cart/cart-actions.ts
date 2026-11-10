"use server";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
  }

  const existingItem = cart?.items?.find(
    (item) => item.product?.toString() === product?._id?.toString(),
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

  revalidatePath("/", "layout");

  return { success: true };
}

export async function removeFromCartAction(productId: string) {
  const session = await auth();

  if (!session || !session?.user) {
    return { error: "Unauthorized: You must be logged in." };
  }

  await connectDB();

  await Cart.updateOne(
    { user: session?.user.id },
    { $pull: { items: { product: productId } } },
  );

  revalidatePath("/", "layout");

  return { success: true };
}

export async function updateCartQuantityAction(
  productId: string,
  quantity: number,
) {
  const session = await auth();

  if (!session || !session?.user) {
    return { error: "Unauthorized: You must be logged in." };
  }

  await connectDB();

  const product = await Product.findById(productId);

  if (quantity > product.stock) {
    return { error: `Only ${product.stock} available` };
  }

  if (!product) return { error: "Not found product" };

  const cart = await Cart.findOne({ user: session?.user.id });

  if (!cart) {
    return { error: "Cart not found" };
  }

  const item = cart.items.find(
    (i) => i.product?.toString() === product._id?.toString(),
  );

  if (!item) return { error: "Item is not in your cart" };

  item.quantity = quantity;

  cart.markModified("items");
  await cart.save();

  revalidatePath("/", "layout");

  return { success: true };
}

export async function getCartCount(userId: string): Promise<number> {
  await connectDB();

  const cart = await Cart.findOne({ user: userId })
    .select("items.quantity")
    .lean();

  const items = (cart?.items ?? []) as { quantity: number }[];
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
