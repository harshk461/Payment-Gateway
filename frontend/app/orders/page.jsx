"use client";

import PayNowModal from "@/components/modal/PayNowModal";
import { useOrder } from "@/hooks/useOrder";
import React, { useState } from "react";

const OrdersPage = () => {
  const { orders, isLoading } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-[Inter,_system-ui,_sans-serif]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        {/* Page header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Your orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View past orders and everything you bought in each.
          </p>
        </header>

        <section className="space-y-5">
          {orders?.map((order) => (
            <article
              key={order.orderId}
              className="rounded-3xl border border-[#eef2ff] bg-white p-4 sm:p-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.orderId}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-slate-500">Placed on</p>
                    <p className="font-medium text-slate-900">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total</p>
                    <p className="font-semibold text-slate-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-indigo-50 text-[#4f46e5]"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Horizontal scroll of products */}
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">
                  Items in this order
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex-none w-44 sm:w-48 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5"
                    >
                      <div className="mb-2 h-24 rounded-xl bg-slate-100" />
                      <p className="text-xs font-medium text-slate-900 line-clamp-2">
                        {product.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Qty {product.qty}</span>
                        <span className="font-semibold text-slate-900">
                          ₹{product.perPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions row */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex gap-3">
                  <button className="underline underline-offset-2 hover:text-slate-700">
                    View order details
                  </button>
                  <button className="underline underline-offset-2 hover:text-slate-700">
                    Reorder items
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Pay now
                </button>
              </div>
            </article>
          ))}

          {orders?.length === 0 && (
            <p className="text-sm text-slate-500">
              You have no orders yet. Once you place an order, it will appear
              here.
            </p>
          )}
        </section>
      </div>
      <PayNowModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </main>
  );
};

export default OrdersPage;
