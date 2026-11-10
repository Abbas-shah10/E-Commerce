import Product from "@/models/Product";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/guards";

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
  revalidatePath("/orders");
  return { success: true, orderId: String(order._id) };
}

export async function readOrdersAction() {
  const user = await requireUser();

  await connectDB();

  const orders = await Order.find({ user: user.id })
    .sort({ createdAt: -1 })
    .lean();

  const orderList = orders.map((order) => ({
    id: String(order._id),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    totalCents: order.totalCents,
  }));

  if (orders.length <= 0) {
    return { error: "You haven’t placed any orders yet" };
  }

  return { success: "fetched all orders successfully", orderList };
}
