"use client";

import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart/cart-actions";

type Props = { productId: string; title: string; disabled?: boolean };

export default function QuickAddButton({ productId, title, disabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleClick() {
    startTransition(async () => {
      const result = await addToCartAction(productId);
      if ("error" in result) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("added");
        setMessage("Added to cart");
      }
      setTimeout(() => setStatus("idle"), 2000);
    });
  }

  const color =
    status === "added"
      ? "bg-emerald-100 text-emerald-700"
      : status === "error"
        ? "bg-red-100 text-red-700"
        : "bg-violet-100 text-violet-700 hover:bg-violet-200";

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPending}
      aria-label={`Add ${title} to cart`}
      title={status === "idle" ? `Add ${title} to cart` : message}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${color}`}
    >
      {isPending
        ? "…"
        : status === "added"
          ? "✓"
          : status === "error"
            ? "!"
            : "+"}
    </button>
  );
}
