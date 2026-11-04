"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart/cart-actions";

type Props = {
  productId: string;
  outOfStock: boolean;
  isLoggedIn: boolean;
};

export default function AddToCartButton({
  productId,
  outOfStock,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/sign-in");
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await addToCartAction(productId);

      if ("error" in result) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Added to cart" });
      }
    });
  };
  return (
    <div className="mt-8">
      <button
        onClick={handleClick}
        disabled={outOfStock || isPending}
        className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {outOfStock ? "Out of stock" : isPending ? "Adding..." : "Add to cart"}
      </button>

      {message && (
        <p
          role="status"
          className={`mt-3 text-sm font-medium ${
            message.type === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
