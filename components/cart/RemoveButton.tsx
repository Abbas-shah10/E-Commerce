"use client";

import { useTransition } from "react";
import { removeFromCartAction } from "@/app/actions/cart/cart-actions";

export default function RemoveButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await removeFromCartAction(productId);
        })
      }
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
