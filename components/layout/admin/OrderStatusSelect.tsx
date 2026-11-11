"use client";
import { updateOrderStatusAction } from "@/app/actions/order/order-actions";
import React, { useState, useTransition } from "react";

const OrderStatusSelect = ({
  orderId,
  current,
  options,
}: {
  orderId: string;
  current: string;
  options: string[];
}) => {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (options.length === 0)
    return <p className="text-sm text-slate-500">No further changes.</p>;
  return (
    <div>
      <select
        disabled={pending}
        defaultValue=""
        className="rounded border px-3 py-1 text-sm"
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;
          startTransition(async () => {
            const res = await updateOrderStatusAction(orderId, value);
            setError(("error" in res ? res.error : "") ?? "");
          });
        }}
      >
        <option value="" disabled>
          Change status ({current})
        </option>
        {options.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default OrderStatusSelect;
