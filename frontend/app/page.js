"use client";

import { useEffect, useState } from "react";

export default function PaymentPage() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:3001/checkout.js";
    script.onload = () => setSdkLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePay = async () => {
    if (!sdkLoaded) {
      alert("Payment SDK not loaded yet");
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch("http://localhost:8080/api/v1/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "test_key_123",
        },
        body: JSON.stringify({
          amount: 10000,
          currency: "INR",
          idempotencyKey: "test_" + Date.now(),
        }),
      });

      const intent = await resp.json();

      const pg = new window.PaymentGateway({
        key: "test_123",
        baseUrl: "http://localhost:8080/api/v1",
      });

      pg.open({
        intentId: intent.intentId,
        amount: intent.amount,
        currency: intent.currency,
      });
    } catch (e) {
      console.error(e);
      alert("Something went wrong while creating the payment.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !sdkLoaded || loading;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-8">
        {/* Left: details */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-950/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/80 mb-1">
                Checkout
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Complete your purchase
              </h1>
            </div>
            <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 border border-slate-700/80">
                <span className="text-emerald-400 text-[10px]">●</span>
                Secure payment
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact */}
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-slate-200">
                Contact information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Full name
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Email address
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-slate-200">
                Shipping address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">
                    Address line
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                    placeholder="Street, area, landmark"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    City
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Pincode
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                    placeholder="400001"
                  />
                </div>
              </div>
            </section>

            {/* Note */}
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-slate-200">
                Order note (optional)
              </h2>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition resize-none"
                placeholder="Add delivery instructions or GST details…"
              />
            </section>

            <p className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/70">
              <span className="text-base">🔒</span>
              Payments are processed securely. Your card details are never
              stored on this device.
            </p>
          </div>
        </div>

        {/* Right: order summary + pay */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-950/60">
            <h2 className="text-sm font-medium text-slate-200 mb-4">
              Order summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Plan</span>
                <span className="font-medium">Pro Subscription</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Billing cycle</span>
                <span>Monthly</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Price</span>
                <span>₹100.00</span>
              </div>

              <div className="border-t border-dashed border-slate-800 my-3" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">GST (18%)</span>
                <span>₹18.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Discount</span>
                <span className="text-emerald-400">- ₹18.00</span>
              </div>

              <div className="border-t border-slate-800 mt-3 pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">
                  Amount due
                </span>
                <span className="text-lg font-semibold">₹100.00</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isDisabled}
              className={`mt-5 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition 
              ${
                isDisabled
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40"
              }`}
            >
              {loading ? "Processing..." : "Pay securely ₹100"}
            </button>

            <p className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                By continuing, you agree to the Terms & Privacy Policy.
              </span>
              <span className="hidden sm:inline-flex gap-1 text-[10px]">
                <span className="px-2 py-0.5 rounded-full border border-slate-700">
                  💳 Cards
                </span>
                <span className="px-2 py-0.5 rounded-full border border-slate-700">
                  UPI
                </span>
                <span className="px-2 py-0.5 rounded-full border border-slate-700">
                  Netbanking
                </span>
              </span>
            </p>
          </div>

          {/* Small reassurance card */}
          <div className="bg-linear-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-base">💡</span>
              <div>
                <p className="font-medium mb-1">Quick tip</p>
                <p className="text-slate-400">
                  After clicking “Pay securely”, a payment popup will open to
                  complete your transaction with your preferred method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
