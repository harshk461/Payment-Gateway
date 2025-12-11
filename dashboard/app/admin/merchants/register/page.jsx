// app/admin/merchants/register/page.tsx
"use client";

import { useState } from "react";

export default function AdminCreateMerchantPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: call POST /merchants/register with admin auth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-xl shadow-slate-950/60">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400/80">
            Admin • Merchant
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Register new merchant
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            Create a merchant profile and generate API keys.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Merchant name
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
                placeholder="Harsh"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Business name
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
                placeholder="Harsh Store"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              placeholder="harsh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1.5">
              Webhook URL
            </label>
            <input
              type="url"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              placeholder="https://merchant.com/webhook/payment"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full rounded-xl py-2.5 text-sm font-medium transition ${
              loading
                ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/40"
            }`}
          >
            {loading ? "Creating..." : "Create merchant"}
          </button>
        </form>
      </div>
    </div>
  );
}
