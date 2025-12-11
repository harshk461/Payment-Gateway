"use client";

import { useState } from "react";

export default function ApiKeysPage() {
  const [publicKey] = useState("pub_test_1234567890abcdef");
  const [secretKey, setSecretKey] = useState(
    "sec_test_abcdefghijklmnopqrstuvwxyz"
  );
  const [showSecret, setShowSecret] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const maskedSecret = "sec_test_" + "•".repeat(20);

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    const confirm = window.confirm(
      "Regenerate secret key?\n\nThe old key will stop working. You must update it in your backend."
    );
    if (!confirm) return;

    try {
      setIsRegenerating(true);
      const resp = await fetch("/merchants/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!resp.ok) {
        throw new Error("Failed to regenerate key");
      }

      const data = await resp.json();
      // Expect data.secretKey from backend
      setSecretKey(data.secretKey || secretKey);
      setShowSecret(true);
    } catch (e) {
      console.error(e);
      alert("Could not regenerate key. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      alert("Copied to clipboard");
    } catch {
      alert("Failed to copy");
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
              API Keys
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              Manage your public and secret keys used to authenticate API
              requests.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-5">
        {/* Info banner */}
        <section className="rounded-2xl border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
          <p className="font-medium mb-1">Keep your secret key safe</p>
          <p>
            Never share your secret key in client-side code, public repos, or
            screenshots. Use the public key in your frontend SDK and the secret
            key only on your backend.
          </p>
        </section>

        {/* Keys cards */}
        <section className="space-y-4">
          {/* Public key */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium text-slate-200">
                  Public key
                </h2>
                <p className="text-[11px] text-slate-500">
                  Safe to use in your frontend integration.
                </p>
              </div>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                Client-side
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
              <span className="font-mono text-[11px] truncate">
                {publicKey}
              </span>
              <button
                onClick={() => copyToClipboard(publicKey)}
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition"
              >
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Secret key */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium text-slate-200">
                  Secret key
                </h2>
                <p className="text-[11px] text-slate-500">
                  Used to sign requests from your backend. Never expose this in
                  the browser.
                </p>
              </div>
              <span className="rounded-full border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-200">
                Server-side only
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
                <span className="font-mono text-[11px] truncate">
                  {showSecret ? secretKey : maskedSecret}
                </span>
                <button
                  onClick={() => setShowSecret((v) => !v)}
                  className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-400 hover:text-slate-100 transition"
                >
                  {showSecret ? "Hide" : "Reveal"}
                </button>
                <button
                  onClick={() => copyToClipboard(secretKey)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition"
                >
                  Copy
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <p className="text-[11px] text-slate-500">
                  Regenerate your secret key if you suspect it has been exposed.
                  Old keys will stop working immediately.
                </p>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    isRegenerating
                      ? "bg-rose-900/40 text-rose-300 cursor-not-allowed"
                      : "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-500/40"
                  }`}
                >
                  {isRegenerating ? "Regenerating..." : "Regenerate secret key"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
