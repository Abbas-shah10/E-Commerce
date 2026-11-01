"use client";
import { useActionState } from "react";

type FormState = { error?: string } | null;

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  defaults?: {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    imageUrl?: string;
  };
};

const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

export default function ProductForm({
  action,
  submitLabel,
  defaults = {},
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    null,
  );

  console.log(defaults);
  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <input
        name="title"
        placeholder="Title"
        defaultValue={defaults.title}
        className={input}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        defaultValue={defaults.description}
        rows={4}
        className={input}
        required
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price (e.g. 19.99)"
        defaultValue={defaults.price}
        className={input}
        required
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        defaultValue={defaults.stock ?? 0}
        className={input}
        required
      />
      <input
        name="category"
        placeholder="Category"
        defaultValue={defaults.category}
        className={input}
        required
      />
      <input
        name="imageUrl"
        placeholder="Image URL (optional)"
        defaultValue={defaults.imageUrl}
        className={input}
      />

      <button
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
