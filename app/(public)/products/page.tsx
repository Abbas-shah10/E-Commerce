import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/layout/Pagination";

const PAGE_SIZE = 10;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  //1 read searchParams values
  const { q, category, sort, page } = await searchParams;

  //2 clean the values
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const SORTS = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  } as const;

  type SortKey = keyof typeof SORTS;

  const sortKey: SortKey = sort && sort in SORTS ? (sort as SortKey) : "newest";

  const categories: string[] = (await Product.distinct("category")).sort();
  const activeCategory =
    category && categories.includes(category) ? category : undefined;

  const query = (q ?? "").trim().slice(0, 50);
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const filter: Record<string, unknown> = {};

  if (activeCategory) {
    filter.category = activeCategory;
  }

  if (query) {
    filter.title = { $regex: safeQuery, $options: "i" };
  }

  await connectDB();
  const [docs, total] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sortKey])
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const products = docs.map((p) => ({
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    category: p.category,
    imageUrl: p.imageUrl ?? undefined,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <ProductGrid products={products} />
      <Pagination
        page={pageNumber}
        totalPages={totalPages}
        makeHref={(p) => {
          const params = new URLSearchParams();
          if (query) params.set("q", query);
          if (activeCategory) params.set("category", activeCategory);
          if (sortKey !== "newest") params.set("sort", sortKey);
          params.set("page", String(p));
          return `/products?${params.toString()}`;
        }}
      />
    </div>
  );
}
