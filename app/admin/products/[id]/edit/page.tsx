import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductForm from "@/components/layout/admin/ProductForm";
import { updateProduct } from "@/app/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // params is a Promise in newer Next.js
  if (!isValidObjectId(id)) notFound();

  await connectDB();
  const p = await Product.findById(id).lean();
  if (!p) notFound();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Edit product</h2>
      <ProductForm
        action={updateProduct.bind(null, id)}
        submitLabel="Save changes"
        defaults={{
          title: p.title,
          description: p.description,
          price: p.price / 100,
          stock: p.stock,
          category: p.category,
          imageUrl: p.imageUrl,
        }}
      />
    </div>
  );
}
