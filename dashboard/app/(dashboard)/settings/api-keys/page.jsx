"use client";

import { useState } from "react";
import { useApiKeys, regenerateSecretKey } from "@/app/hooks/useApiKeys";

export default function ApiKeysPage() {
  const { keys, loading, refresh } = useApiKeys();

  const [showSecret, setShowSecret] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!keys) return <div className="text-red-400 p-8">Failed to load keys</div>;

  const { publicKey, secretKey, secretKeyMasked } = keys;

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    if (!confirm("Regenerate secret key?\nOld key will stop working.")) return;

    try {
      setIsRegenerating(true);
      await regenerateSecretKey();
      await refresh(); // refresh AES-decrypted keys
      setShowSecret(true);
      alert("Secret key regenerated!");
    } catch (e) {
      console.error(e);
      alert("Failed to regenerate key");
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = async (value) => {
    await navigator.clipboard.writeText(value);
    alert("Copied");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
            Settings
          </p>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            API Keys
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-5">
        {/* --- Public Key --- */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-200">Public Key</h2>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
              Client-side
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
            <span className="font-mono text-[11px] truncate">{publicKey}</span>

            <button
              onClick={() => copyToClipboard(publicKey)}
              className="ml-auto rounded-full border border-slate-700 px-2 py-1 text-[10px] hover:text-emerald-300 hover:border-emerald-500"
            >
              Copy
            </button>
          </div>
        </div>

        {/* --- Secret Key --- */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-200">Secret Key</h2>
            <span className="rounded-full border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-200">
              Server-side Only
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Secret Key Box */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
              <span className="font-mono text-[11px] truncate">
                {showSecret ? secretKey : secretKeyMasked}
              </span>

              <button
                onClick={() => setShowSecret((v) => !v)}
                className="ml-auto rounded-full border border-slate-700 px-2 py-1 text-[10px] hover:text-slate-100"
              >
                {showSecret ? "Hide" : "Reveal"}
              </button>

              <button
                onClick={() => copyToClipboard(secretKey)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[10px] hover:text-emerald-300 hover:border-emerald-500"
              >
                Copy
              </button>
            </div>

            {/* Regenerate Button */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <p className="text-[11px] text-slate-500">
                Regenerate your secret key if it&apos;s exposed.
              </p>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className={`rounded-xl px-3 py-2 text-xs transition ${
                  isRegenerating
                    ? "bg-rose-900/40 text-rose-300 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-500"
                }`}
              >
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
