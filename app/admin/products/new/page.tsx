import ProductForm from "@/components/layout/admin/ProductForm";
import { createProduct } from "@/app/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">New product</h2>
      <ProductForm action={createProduct} submitLabel="Create product" />
    </div>
  );
}
