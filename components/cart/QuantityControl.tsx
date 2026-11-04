"use client";

import { useState, useTransition } from "react";
import { updateCartQuantityAction } from "@/app/actions/cart/cart-actions";

type Props = { productId: string; quantity: number; stock: number };

export default function QuantityControl({ productId, quantity, stock }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function change(newQuantity: number) {
    setError(null);
    startTransition(async () => {
      const result = await updateCartQuantityAction(productId, newQuantity);
      if ("error" in result) setError(result?.error);
    });
  }

  const button =
    "grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-lg disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => change(quantity - 1)}
          disabled={isPending || quantity <= 1}
          aria-label="Decrease quantity"
          className={button}
        >
          −
        </button>
        <span className="w-6 text-center font-medium">{quantity}</span>
        <button
          onClick={() => change(quantity + 1)}
          disabled={isPending || quantity >= stock}
          aria-label="Increase quantity"
          className={button}
        >
          +
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
