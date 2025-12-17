import React from "react";

// ProductPage.jsx
const ProductPage = () => {
  const product = {
    name: "Calm Knit Sneakers",
    description:
      "Soft, breathable knit sneakers designed for everyday comfort. Lightweight cushioning and secure fit keep you moving all day.",
    price: 129,
    color: "Cloud grey",
    sizes: ["40", "41", "42", "43"],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-10">
        {/* Breadcrumb / small header */}
        <div className="mb-6 text-xs sm:text-sm text-slate-500">
          <span className="hover:text-slate-700 cursor-pointer">Home</span>
          <span className="mx-1">/</span>
          <span className="hover:text-slate-700 cursor-pointer">Sneakers</span>
          <span className="mx-1">/</span>
          <span className="text-slate-700">{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* Left: Large product image */}
          <section className="w-full">
            <div className="relative rounded-3xl bg-slate-100 overflow-hidden aspect-square max-h-[520px]">
              {/* Replace this div with real <img /> */}
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                Product image
              </div>
            </div>
          </section>

          {/* Right: Product details */}
          <section className="w-full">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
              {product.name}
            </h1>

            <p className="text-sm text-slate-500 mb-4">
              {product.color} • Unisex
            </p>

            <p className="text-sm sm:text-base text-slate-600 mb-5 max-w-md">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-2xl font-semibold">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                Free next‑day delivery
              </p>
            </div>

            {/* Size selector (optional) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-800">Size</p>
                <button className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={size}
                    className={`h-9 min-w-10 rounded-full border text-xs font-medium ${
                      idx === 2
                        ? "border-[#4f46e5] bg-indigo-50 text-[#4f46e5]"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart + trust copy */}
            <div className="space-y-3">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center h-11 rounded-full
                           bg-linear-to-r from-[#4f46e5] to-[#6366f1]
                           text-sm font-medium text-white shadow-md shadow-indigo-200
                           hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-px
                           focus:outline-none focus:ring-4 focus:ring-indigo-100
                           active:translate-y-0 active:shadow-sm transition"
              >
                Add to Cart
              </button>

              <p className="text-xs text-slate-500">
                Secure payments • Easy returns within 7 days • 24/7 support
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
