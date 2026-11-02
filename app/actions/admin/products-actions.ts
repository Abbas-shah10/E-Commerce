"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/guards";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/validations/Product";
import { auth } from "@/lib/auth";
import { isValidObjectId } from "mongoose";
import { slugify } from "@/lib/utils";
type FormState = { error?: string } | null;

export async function createProduct(_prev: FormState, formData: FormData) {
  const session = await auth();
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();

  const { description, imageUrl, price, title, category, stock } = parsed.data;
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 2;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  await Product.create({
    user: session?.user?.id,
    title,
    description,
    category,
    stock,
    price,
    imageUrl: imageUrl || undefined,
    slug,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await connectDB();

  const { description, imageUrl, price, title, category, stock } = parsed.data;

  await Product.findByIdAndUpdate(id, {
    description,
    imageUrl,
    price,
    title,
    category,
    stock,
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  if (!isValidObjectId(id)) return;

  await connectDB();
  await Product.findByIdAndDelete(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
