// app/admin/merchants/[merchantId]/settings/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function AdminMerchantSettingsPage() {
  const { merchantId } = useParams();
  const [merchantName, setMerchantName] = useState("Harsh");
  const [businessName, setBusinessName] = useState("Harsh Store");
  const [email, setEmail] = useState("harsh@example.com");
  const [webhookUrl, setWebhookUrl] = useState(
    "https://harshstore.com/webhook/payment"
  );
  const [status, setStatus] = useState("ACTIVE");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: call admin config update endpoint for this merchant
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin · Merchant #{merchantId}
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Merchant settings
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              Update profile, status and webhook configuration for this
              merchant.
            </p>
          </div>
          <a
            href={`/admin/merchants/${merchantId}`}
            className="text-[11px] text-slate-400 hover:text-sky-300"
          >
            ← Back to merchant
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Merchant name
              </label>
              <input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Used for payout and alert emails.
              </p>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">
                Status
              </span>
              <button
                type="button"
                onClick={() =>
                  setStatus((s) => (s === "ACTIVE" ? "SUSPENDED" : "ACTIVE"))
                }
                className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 pr-3 text-[11px] transition ${
                  status === "ACTIVE"
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-500/60 bg-amber-500/10 text-amber-100"
                }`}
              >
                <span
                  className={`h-4 w-7 rounded-full p-0.5 transition ${
                    status === "ACTIVE"
                      ? "bg-emerald-500/80"
                      : "bg-amber-500/80"
                  }`}
                >
                  <span
                    className={`block h-3 w-3 rounded-full bg-slate-950 transition-transform ${
                      status === "ACTIVE" ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </span>
                <span>{status === "ACTIVE" ? "Active" : "Suspended"}</span>
              </button>
              <p className="mt-1 text-[11px] text-slate-500">
                Suspended merchants cannot create or capture new payments.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              All events for this merchant will be posted to this URL.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              Changes apply immediately for this merchant&apos;s traffic.
            </p>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                saving
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/40"
              }`}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
