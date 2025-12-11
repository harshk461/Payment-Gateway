// app/admin/merchants/[merchantId]/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";

const MOCK_MERCHANT = {
  id: 12,
  name: "Harsh",
  businessName: "Harsh Store",
  email: "harsh@example.com",
  webhookUrl: "https://harshstore.com/webhook/payment",
  status: "ACTIVE",
  riskScore: 18,
  publicKey: "pk_test_123456abcd",
  secretKey: "sk_test_9876abcd321",
  documents: [
    { name: "PAN document", status: "VERIFIED" },
    { name: "GST certificate", status: "PENDING" },
  ],
};

const formatRiskColor = (score) => {
  if (score <= 25)
    return "text-emerald-300 bg-emerald-500/10 border-emerald-500/40";
  if (score <= 60) return "text-amber-200 bg-amber-500/10 border-amber-500/40";
  return "text-rose-300 bg-rose-500/10 border-rose-500/40";
};

export default function AdminMerchantDetailsPage() {
  const params = useParams();
  const merchantId = params?.merchantId;

  // TODO: fetch by merchantId; using mock for now
  const merchant = useMemo(() => MOCK_MERCHANT, [merchantId]);

  const maskedSecret =
    merchant.secretKey.slice(0, 8) +
    "•".repeat(Math.max(4, merchant.secretKey.length - 8));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin · Merchant
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                {merchant.businessName}
              </h1>
              <span className="hidden md:inline-flex items-center text-[11px] text-slate-500 gap-1">
                <span className="text-slate-600">/</span>
                <span>ID #{merchant.id}</span>
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Managed contact: {merchant.name} · {merchant.email}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] border ${
                merchant.status === "ACTIVE"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/60 bg-amber-500/10 text-amber-100"
              }`}
            >
              {merchant.status === "ACTIVE" ? "Active" : "Suspended"}
            </span>
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-500/80 hover:text-sky-300 transition"
              onClick={() => {
                // TODO: open shadow-mode as merchant dashboard
              }}
            >
              <span>👁</span>
              <span>View as merchant</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-5">
        {/* Top: profile + quick actions */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
          {/* Profile / webhook / docs */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-3">
                Merchant profile
              </h2>
              <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-2">
                <div>
                  <p className="text-slate-500 text-[11px]">Merchant name</p>
                  <p className="text-sm">{merchant.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Business name</p>
                  <p className="text-sm">{merchant.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Email</p>
                  <p className="text-sm">{merchant.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Webhook URL</p>
                  <p className="text-[11px] font-mono break-all">
                    {merchant.webhookUrl}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-slate-200">
                  Risk & documents
                </h2>
                <span
                  className={
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] border " +
                    formatRiskColor(merchant.riskScore)
                  }
                >
                  Risk score {merchant.riskScore}/100
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-400">
                  This score summarizes chargebacks, disputes, error rates and
                  refund behaviour for this merchant.
                </p>
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
                    style={{ width: `${Math.min(100, merchant.riskScore)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-medium text-slate-300 mb-1">
                    Documents (KYB)
                  </p>
                  {merchant.documents && merchant.documents.length > 0 ? (
                    <ul className="space-y-1">
                      {merchant.documents.map((doc) => (
                        <li
                          key={doc.name}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-slate-300">{doc.name}</span>
                          <span
                            className={
                              "inline-flex items-center rounded-full px-2 py-0.5 border text-[10px] " +
                              (doc.status === "VERIFIED"
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                : doc.status === "PENDING"
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                                : "border-rose-500/40 bg-rose-500/10 text-rose-300")
                            }
                          >
                            {doc.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      No documents uploaded yet. KYB can be added later.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Keys + quick actions */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-3">
                API keys
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Public key</p>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                    <span className="font-mono text-[11px] truncate">
                      {merchant.publicKey}
                    </span>
                    <button
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-sky-500 hover:text-sky-300 transition"
                      onClick={() =>
                        navigator.clipboard.writeText(merchant.publicKey)
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Secret key</p>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                    <span className="font-mono text-[11px] truncate">
                      {maskedSecret}
                    </span>
                    <button
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-rose-500 hover:text-rose-300 transition"
                      onClick={() => {
                        // TODO: maybe show in modal with extra confirmation
                      }}
                    >
                      Reveal (admin)
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Secret keys should only be visible to super-admins for
                    debugging and rotation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-3">
                Quick actions
              </h2>
              <div className="grid gap-2 text-[11px]">
                <button
                  className={`inline-flex items-center justify-between rounded-xl px-3 py-2 border text-xs transition ${
                    merchant.status === "ACTIVE"
                      ? "border-rose-500/60 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      : "border-emerald-500/60 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                  }`}
                  onClick={() => {
                    // TODO: call /merchants/disable or /merchants/enable
                  }}
                >
                  <span>
                    {merchant.status === "ACTIVE"
                      ? "Suspend merchant"
                      : "Re-activate merchant"}
                  </span>
                  <span>⚠️</span>
                </button>

                <button
                  className="inline-flex items-center justify-between rounded-xl px-3 py-2 border border-sky-500/60 bg-sky-500/10 text-xs text-sky-100 hover:bg-sky-500/20 transition"
                  onClick={() => {
                    // TODO: POST /merchants/regenerate
                  }}
                >
                  <span>Regenerate API keys</span>
                  <span>🔐</span>
                </button>

                <button
                  className="inline-flex items-center justify-between rounded-xl px-3 py-2 border border-amber-500/60 bg-amber-500/10 text-xs text-amber-100 hover:bg-amber-500/20 transition"
                  onClick={() => {
                    // TODO: open modal / flow to update webhook URL
                  }}
                >
                  <span>Reset webhook URL</span>
                  <span>↻</span>
                </button>

                <button
                  className="inline-flex items-center justify-between rounded-xl px-3 py-2 border border-slate-700 bg-slate-950/70 text-xs text-slate-200 hover:border-slate-500 hover:text-slate-50 transition"
                  onClick={() => {
                    // TODO: navigate to /admin/logs?merchantId=...
                  }}
                >
                  <span>View merchant logs</span>
                  <span>📜</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-purple-500/10 p-4 text-[11px] text-slate-200">
              <p className="font-medium mb-1">Shadow mode</p>
              <p className="text-slate-300">
                Use “View as merchant” to open the standard dashboard in a
                read-only context, useful for debugging issues reported by this
                merchant without sharing their credentials.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
