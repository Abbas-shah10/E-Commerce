"use client";

import Image from "next/image";
import React, { useState } from "react";

const initialItems = [
  {
    id: 1,
    name: "Cloud Runner Sneakers",
    color: "Stone / Sand",
    size: "EU 42",
    price: 129,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Essential Carryall",
    color: "Midnight",
    size: "One size",
    price: 89,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
  },
];

const CartPage = () => {
  const [items, setItems] = useState(initialItems);

  const updateQuantity = (id: number, change: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const freeShippingAt = 250;
  const shippingProgress = Math.min((subtotal / freeShippingAt) * 100, 100);

  return (
    <main className="min-h-screen bg-[#f4f4ef] px-4 py-10 text-[#1b1b1b] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-end justify-between border-b border-black/10 pb-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#777a5d]">
              Your selection
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Shopping Cart{" "}
              <span className="text-[#777a5d]">({items.length})</span>
            </h1>
          </div>
          <a
            href="#"
            className="hidden text-sm font-medium underline underline-offset-4 sm:block"
          >
            Continue shopping
          </a>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="group grid grid-cols-[112px_1fr] gap-4 rounded-[2rem] bg-white p-4 shadow-[0_10px_40px_rgba(28,28,20,0.06)] sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-5"
              >
                <div className="overflow-hidden rounded-[1.5rem] bg-[#ecece4]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="h-full min-h-[150px] w-full object-cover transition duration-500 group-hover:scale-105"
                    width={800}
                    height={800}
                  />
                </div>

                <div className="flex min-w-0 flex-col py-1 sm:py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold sm:text-xl">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-black/45">
                        {item.color} <span className="mx-1">·</span> {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setItems((current) =>
                          current.filter((cartItem) => cartItem.id !== item.id),
                        )
                      }
                      className="grid size-8 shrink-0 place-items-center rounded-full text-black/40 transition hover:bg-black/5 hover:text-black"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center rounded-full border border-black/10 bg-[#f7f7f3] p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="grid size-8 place-items-center rounded-full text-lg transition hover:bg-white hover:shadow-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="grid size-8 place-items-center rounded-full text-lg transition hover:bg-white hover:shadow-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-semibold sm:text-xl">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-[0_10px_40px_rgba(28,28,20,0.06)]">
                <p className="text-xl font-semibold">Your cart is empty</p>
                <p className="mt-2 text-sm text-black/45">
                  Discover something you’ll love.
                </p>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-[2rem] bg-[#202117] p-6 text-white shadow-[0_20px_50px_rgba(32,33,23,0.16)] sm:p-8 lg:sticky lg:top-6">
            <h2 className="text-2xl font-semibold">Order summary</h2>

            <div className="mt-7 border-b border-white/10 pb-6">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Estimated shipping</span>
                <span className="font-medium">
                  {subtotal >= freeShippingAt ? "Free" : "$12.00"}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white/[0.07] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 text-[#c9cc9e]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {subtotal >= freeShippingAt ? (
                  <span>You unlocked free shipping!</span>
                ) : (
                  <span>
                    ${(freeShippingAt - subtotal).toFixed(0)} away from free
                    shipping
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#c9cc9e] transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-white/50">Total</p>
                <p className="mt-1 text-sm text-white/50">Including taxes</p>
              </div>
              <p className="text-3xl font-semibold">
                $
                {(
                  subtotal +
                  (subtotal >= freeShippingAt || subtotal === 0 ? 0 : 12)
                ).toFixed(2)}
              </p>
            </div>

            <button className="mt-7 flex w-full items-center justify-between rounded-full bg-[#d8dcaa] px-6 py-4 text-sm font-bold text-[#202117] transition hover:bg-[#e4e7bb]">
              Secure checkout
              <span className="grid size-8 place-items-center rounded-full bg-[#202117] text-white">
                →
              </span>
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40">
              <svg
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 018 0v3" />
              </svg>
              Secure and encrypted checkout
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
