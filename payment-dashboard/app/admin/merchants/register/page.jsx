"use client";

import axios from "axios";
import { useState } from "react";

export default function AdminCreateMerchantPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Success response state
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/register`,
        {
          name,
          businessName,
          email,
          webhookUrl,
        }
      );

      setResult(response.data); // contains merchantId, keys, password
    } catch (err) {
      alert("Failed to create merchant. Check console.");
      console.error(err);
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

        {/* ---------- SUCCESS MODAL BOX ---------- */}
        {result && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-200">
            <p className="text-sm font-semibold mb-2 text-emerald-300">
              Merchant created successfully!
            </p>

            <div className="space-y-2">
              <p>
                <span className="text-slate-400">Merchant ID:</span>{" "}
                {result.merchantId}
              </p>
              <p>
                <span className="text-slate-400">Email:</span> {result.email}
              </p>
              <p>
                <span className="text-slate-400">Temporary password:</span>{" "}
                <span className="font-mono">{result.password}</span>
              </p>

              <p>
                <span className="text-slate-400">Public key:</span>{" "}
                <span className="font-mono">{result.publicKey}</span>
              </p>

              <p>
                <span className="text-slate-400">Secret key:</span>{" "}
                <span className="font-mono">{result.secretKey}</span>
              </p>
            </div>

            <p className="mt-3 text-[10px] text-emerald-300/70">
              Provide these credentials to the merchant. They should change the
              password immediately after first login.
            </p>

            <button
              onClick={() => setResult(null)}
              className="mt-3 rounded-full border border-emerald-600 px-3 py-1 text-[11px] text-emerald-300 hover:bg-emerald-600/20 transition"
            >
              OK
            </button>
          </div>
        )}

        {/* ---------- REGISTER FORM ---------- */}
        {!result && (
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
              <label className="block text-xs text-slate-300 mb-1.5">
                Email
              </label>
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
        )}
      </div>
    </div>
  );
}
