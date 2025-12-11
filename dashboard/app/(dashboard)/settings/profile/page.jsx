// app/dashboard/settings/profile/page.tsx
"use client";

import { useState } from "react";

export default function ProfileSettingsPage() {
  const [merchantName, setMerchantName] = useState("Acme Payments");
  const [businessName, setBusinessName] = useState(
    "Acme Technologies Pvt. Ltd."
  );
  const [email, setEmail] = useState("ops@acmepayments.com");
  const [webhookUrl, setWebhookUrl] = useState(
    "https://merchant.com/webhooks/payments"
  );
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Call your backend update endpoint
      await fetch("/api/merchant/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantName,
          businessName,
          email,
          webhookUrl,
          status: active ? "active" : "disabled",
        }),
      });
      alert("Profile updated");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              Settings
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Profile & Business
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              Configure your merchant identity, contact email, and webhook URL.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
        >
          {/* Merchant & business names */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Merchant name
              </label>
              <input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                placeholder="Display name in dashboard"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                placeholder="Legal entity name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
                placeholder="Primary contact email"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Used for payout notifications and critical alerts.
              </p>
            </div>

            {/* Status toggle */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="block text-xs font-medium text-slate-300 mb-1.5">
                  Status
                </span>
                <button
                  type="button"
                  onClick={() => setActive((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 pr-3 text-[11px] transition ${
                    active
                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                      : "border-slate-700 bg-slate-900/70 text-slate-400"
                  }`}
                >
                  <span
                    className={`h-4 w-7 rounded-full p-0.5 transition ${
                      active ? "bg-emerald-500/80" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`block h-3 w-3 rounded-full bg-slate-950 transition-transform ${
                        active ? "translate-x-3" : "translate-x-0"
                      }`}
                    />
                  </span>
                  <span>{active ? "Active" : "Disabled"}</span>
                </button>
                <p className="mt-1 text-[11px] text-slate-500">
                  Disabled merchants cannot create or process new payments.
                </p>
              </div>
            </div>
          </div>

          {/* Webhook URL */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition"
              placeholder="https://your-domain.com/webhooks/payments"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              All payment events will be sent to this URL. Ensure it is publicly
              reachable and returns 2xx on success.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              Changes affect new payment flows immediately after saving.
            </p>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                saving
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/40"
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
