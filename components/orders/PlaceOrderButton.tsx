"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/app/actions/order/order-actions";

export default function PlaceOrderButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createOrderAction();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.push("/orders"); // later: `/orders/${result.orderId}`
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || isPending}
        className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Placing order..." : "Place order"}
      </button>
      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
