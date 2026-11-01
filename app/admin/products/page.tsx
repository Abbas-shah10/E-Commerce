import { deleteProduct } from "@/app/actions/products";
import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Product from "@/models/Product";
import Link from "next/link";
import React from "react";

const AdminProductsPage = async () => {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-slate-500">No products yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Category</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const id = String(p._id);
                return (
                  <tr key={id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{formatPrice(Math.round(p.price * 100))}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="flex gap-3 p-3">
                      <Link
                        href={`/admin/products/${id}/edit`}
                        className="text-indigo-600"
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct.bind(null, id)}>
                        <button className="text-red-600">Delete</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
