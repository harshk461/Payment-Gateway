"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/api";
import toast from "react-hot-toast";

// simple debounce helper
const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const CartPage = () => {
  const { cartItems, cartTotal: subtotal } = useCart();
  const [quantities, setQuantities] = useState({});
  const debouncedUpdateRef = useRef(null);

  const shipping = 0;
  const taxEstimate = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + taxEstimate;

  // sync quantities with cart
  useEffect(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.productId] = item.quantity;
    });
    setQuantities(map);
  }, [cartItems]);

  // debounced API updater
  const debouncedUpdateQuantity = (productId, quantity) => {
    if (!debouncedUpdateRef.current) {
      debouncedUpdateRef.current = debounce(async (pid, qty) => {
        try {
          await apiRequest.put("/orders/cart/quantity", {
            productId: pid,
            quantity: qty,
          });
        } catch {
          toast.error("Failed to update quantity");
        }
      }, 500);
    }
    debouncedUpdateRef.current(productId, quantity);
  };

  const handleRemove = async (productId) => {
    try {
      await apiRequest.put("/orders/cart/remove", { productId });
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await apiRequest.post("/orders");
    } catch (err) {
      console.log(err);
      toast.error(err || "Something went wrong");
    }
  };
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your items and place your order securely.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] items-start">
          {/* Cart Items */}
          <section className="space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-[#eef2ff] bg-white p-3 sm:p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-slate-100" />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-medium">
                        {item.productName}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base font-semibold">
                      ₹{item.productPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Quantity */}
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                      <button
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-slate-100"
                        onClick={() => {
                          const newQty = Math.max(
                            1,
                            quantities[item.productId] - 1
                          );
                          setQuantities((prev) => ({
                            ...prev,
                            [item.productId]: newQty,
                          }));
                          debouncedUpdateQuantity(item.productId, newQty);
                        }}
                      >
                        −
                      </button>

                      <span className="mx-2 text-sm font-medium">
                        {quantities[item.productId]}
                      </span>

                      <button
                        className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-slate-100"
                        onClick={() => {
                          const newQty = quantities[item.productId] + 1;
                          setQuantities((prev) => ({
                            ...prev,
                            [item.productId]: newQty,
                          }));
                          debouncedUpdateQuantity(item.productId, newQty);
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-xs text-slate-400 hover:text-slate-700"
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {cartItems.length === 0 && (
              <p className="text-sm text-slate-500">
                Your cart is empty. Start adding products to see them here.
              </p>
            )}
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-[#eef2ff] bg-white p-4 sm:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <h2 className="text-base font-semibold mb-4">Order summary</h2>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </dd>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <dt className="text-slate-500">Tax</dt>
                  <dd className="font-medium">
                    ₹{taxEstimate.toLocaleString("en-IN")}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 flex justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-lg font-semibold">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                className="mt-4 w-full h-11 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-medium"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
