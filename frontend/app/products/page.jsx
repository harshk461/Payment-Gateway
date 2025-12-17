"use client";

import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get("/orders/products");

      if (response) {
        setProducts(response);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingLoading(true);
      const body = {
        productId,
        quantity: 1,
      };
      const response = await apiRequest.post("/orders/add-to-cart", body);

      if (response) {
        toast.success("Product added to cart");
        router.push("/cart");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddingLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 font-[Inter,system-ui,sans-serif] flex flex-col">
      {/* Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8">
          {/* Top filter / category bar */}
          <section className="mb-6 md:mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                All products
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Browse calm, curated picks across categories.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700">
                All
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50">
                Shoes
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50">
                Bags
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50">
                Electronics
              </button>
              <button className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50">
                <span>Sort</span>
                <span className="text-[10px]">▾</span>
              </button>
            </div>
          </section>

          {/* Product grid */}
          <section>
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col rounded-2xl border border-[#eef2ff] bg-white p-3 sm:p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
                >
                  {/* Image placeholder */}
                  <div className="mb-3 h-40 sm:h-44 rounded-xl bg-slate-100">
                    {/* <img src={product.imageUrl} alt={product.name} /> */}
                  </div>

                  {/* Info */}
                  <h2 className="text-sm sm:text-base font-medium mb-1">
                    {product.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  {/* Add to cart */}
                  <button
                    type="button"
                    className="mt-auto inline-flex w-full items-center justify-center h-9 rounded-full
                               bg-linear-to-r from-[#4f46e5] to-[#6366f1]
                               text-xs sm:text-sm font-medium text-white shadow-sm shadow-indigo-200
                               hover:shadow-md hover:shadow-indigo-300 hover:-translate-y-px
                               focus:outline-none focus:ring-4 focus:ring-indigo-100
                               active:translate-y-0 active:shadow-sm transition"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AllProductsPage;
