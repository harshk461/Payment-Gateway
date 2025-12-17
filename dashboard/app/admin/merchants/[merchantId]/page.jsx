"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  suspendMerchant,
  activateMerchant,
  regenerateMerchantKeys,
  resetWebhookUrl,
  generateShadowModeToken,
  fetchMerchantById,
} from "@/app/hooks/useAdminMerchants";

const formatRiskColor = (score) => {
  if (score <= 25)
    return "text-emerald-300 bg-emerald-500/10 border-emerald-500/40";
  if (score <= 60) return "text-amber-200 bg-amber-500/10 border-amber-500/40";
  return "text-rose-300 bg-rose-500/10 border-rose-500/40";
};

export default function AdminMerchantDetailsPage() {
  const { merchantId } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  // Load merchant details
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMerchantById(merchantId);
      setMerchant(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [merchantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300 text-sm">
        Loading merchant...
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-sm">
        Merchant not found
      </div>
    );
  }

  const maskedSecret =
    merchant.secretKey?.slice(0, 8) +
    "•".repeat(Math.max(4, merchant.secretKey.length - 8));

  // Actions
  const handleSuspendOrActivate = async () => {
    setReloading(true);
    try {
      if (merchant.status === "ACTIVE") {
        await suspendMerchant(merchantId);
      } else {
        await activateMerchant(merchantId);
      }
      await load();
    } finally {
      setReloading(false);
    }
  };

  const handleRegenerateKeys = async () => {
    setReloading(true);
    try {
      await regenerateMerchantKeys(merchantId);
      await load();
      alert("API keys regenerated!");
    } finally {
      setReloading(false);
    }
  };

  const handleResetWebhook = async () => {
    const url = prompt("Enter new webhook URL:");
    if (!url) return;
    setReloading(true);
    try {
      await resetWebhookUrl(merchantId, url);
      await load();
    } finally {
      setReloading(false);
    }
  };

  const handleShadowMode = async () => {
    const token = await generateShadowModeToken(merchantId);
    window.open(`/dashboard?shadowJwt=${token}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin · Merchant
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {merchant.businessName}
              </h1>
              <span className="text-[11px] text-slate-500">
                / ID #{merchant.id}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {merchant.name} · {merchant.email}
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
              {merchant.status}
            </span>
            <button
              onClick={handleShadowMode}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-500 hover:text-sky-300"
            >
              👁 View as merchant
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <section className="grid gap-4 lg:grid-cols-[1.7fr_1.3fr]">
          {/* PROFILE */}
          <div className="space-y-4">
            {/* Merchant Profile */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-sm font-medium mb-3">Merchant profile</h2>

              <div className="grid gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Merchant name</p>
                  <p>{merchant.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Business name</p>
                  <p>{merchant.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p>{merchant.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Webhook URL</p>
                  <p className="font-mono break-all">{merchant.webhookUrl}</p>
                </div>
              </div>
            </div>

            {/* Risk + Docs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium">Risk & documents</h2>
                <span
                  className={
                    "inline-flex items-center rounded-full px-2 py-1 text-[10px] border " +
                    formatRiskColor(merchant.riskScore)
                  }
                >
                  Risk score {merchant.riskScore}/100
                </span>
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full mb-3">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
                  style={{ width: `${merchant.riskScore}%` }}
                />
              </div>

              {/* Docs */}
              <div className="space-y-2">
                <p className="text-[11px]">Documents</p>
                {merchant.documents.length > 0 ? (
                  merchant.documents.map((d) => (
                    <div
                      key={d.name}
                      className="flex justify-between text-[11px]"
                    >
                      <span>{d.name}</span>
                      <span className="border px-2 py-0.5 rounded-full">
                        {d.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500">
                    No documents uploaded.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* KEYS + ACTIONS */}
          <div className="space-y-4">
            {/* API Keys */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-sm font-medium mb-3">API keys</h2>

              <div className="text-xs space-y-3">
                {/* Public */}
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Public key</p>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 flex items-center gap-2">
                    <span className="font-mono">{merchant.publicKey}</span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(merchant.publicKey)
                      }
                      className="ml-auto border rounded-full px-2 py-1 text-[10px]"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Secret */}
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Secret key</p>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 flex items-center gap-2">
                    <span className="font-mono">{maskedSecret}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-sm font-medium mb-3">Quick actions</h2>

              <div className="grid gap-2 text-xs">
                <button
                  onClick={handleSuspendOrActivate}
                  disabled={reloading}
                  className={`rounded-xl px-3 py-2 border ${
                    merchant.status === "ACTIVE"
                      ? "border-rose-500/60 bg-rose-500/10"
                      : "border-emerald-500/60 bg-emerald-500/10"
                  }`}
                >
                  {merchant.status === "ACTIVE"
                    ? "Suspend merchant ⚠️"
                    : "Re-activate merchant ✔️"}
                </button>

                <button
                  onClick={handleRegenerateKeys}
                  className="rounded-xl px-3 py-2 border border-sky-500/60 bg-sky-500/10"
                >
                  Regenerate API keys 🔐
                </button>

                <button
                  onClick={handleResetWebhook}
                  className="rounded-xl px-3 py-2 border border-amber-500/60 bg-amber-500/10"
                >
                  Reset webhook URL ↻
                </button>

                <button className="rounded-xl px-3 py-2 border border-slate-700 bg-slate-950">
                  View logs 📜
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
