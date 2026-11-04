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
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
