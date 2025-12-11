// app/admin/overview/page.tsx
"use client";

import React from "react";

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                Global Overview
              </h1>
              <span className="hidden md:inline-flex items-center text-[11px] text-slate-500 gap-1">
                <span className="text-slate-600">/</span>
                <span>Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-sky-500/80 hover:text-sky-300 transition"
            >
              <span>🧾</span>
              <span>Merchant view</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Merchant stats row */}
        <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            label="Total merchants"
            value="128"
            pill="+6 this week"
            color="emerald"
          />
          <StatCard
            label="Active merchants"
            value="112"
            pill="87.5% active"
            color="sky"
          />
          <StatCard
            label="Suspended merchants"
            value="16"
            pill="Manual review"
            color="amber"
          />
          <StatCard
            label="System error rate"
            value="0.23%"
            pill="Last 24h"
            color="rose"
          />
        </section>

        {/* Transactions & volume */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-medium text-slate-200">
                    Transactions today
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Real-time across all merchants
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-300">
                  Success rate 97.2%
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Transactions today</p>
                  <p className="text-lg font-semibold">12,483</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    +8.1% vs yesterday
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Succeeded</p>
                  <p className="text-lg font-semibold text-emerald-300">
                    12,142
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Includes cards, UPI, wallets, netbanking
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Failed</p>
                  <p className="text-lg font-semibold text-rose-300">341</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Most due to insufficient funds
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-medium text-slate-200">
                    Volume processed
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Last 7 days · across all merchants
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/70 border border-slate-800 px-1 py-1">
                  <button className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-100">
                    7d
                  </button>
                  <button className="rounded-full px-2.5 py-0.5 text-[11px] text-slate-400 hover:text-slate-100">
                    30d
                  </button>
                </div>
              </div>

              {/* Placeholder chart */}
              <div className="relative mt-2 h-48 rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                <p className="text-xs text-slate-500">
                  Chart placeholder – render global volume chart here
                </p>
              </div>
            </div>
          </div>

          {/* Error / refunds / settlements */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="text-sm font-medium text-slate-200 mb-3">
                Operational metrics (today)
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">System error rate</span>
                  <span className="text-rose-300 font-medium">0.23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Failed transactions</span>
                  <span>341</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Refund count</span>
                  <span className="text-amber-300 font-medium">129</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Settlement pending</span>
                  <span className="text-sky-300 font-medium">72</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-slate-400 text-xs">
                    Next payout window
                  </span>
                  <span className="text-sm font-medium">
                    Today · 10:30 PM IST
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-purple-500/10 p-4 text-xs text-slate-200">
              <p className="font-medium mb-1">Monitoring summary</p>
              <p className="text-slate-300">
                Error rate is below alert threshold and settlements are within
                normal range. Keep an eye on failed transactions for any
                provider-side issues.
              </p>
            </div>
          </div>
        </section>

        {/* Quick table: failed / refunds highlight */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-slate-200">
                Today&apos;s risk & refunds
              </h2>
              <p className="text-[11px] text-slate-500">
                Sample of failed and refunded transactions across merchants
              </p>
            </div>
            <button className="text-xs text-slate-400 hover:text-slate-100">
              View full logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-left font-normal">Merchant</th>
                  <th className="py-2 text-left font-normal">Txn ID</th>
                  <th className="py-2 text-left font-normal">Type</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                  <th className="py-2 text-left font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  {
                    merchant: "Harsh Store",
                    id: "txn_abc123",
                    type: "Payment",
                    amount: "₹2,499.00",
                    status: "Failed",
                    time: "09:12 AM",
                  },
                  {
                    merchant: "Acme Mart",
                    id: "rf_9821",
                    type: "Refund",
                    amount: "₹799.00",
                    status: "Refunded",
                    time: "09:05 AM",
                  },
                  {
                    merchant: "Nova Fashion",
                    id: "txn_def456",
                    type: "Payment",
                    amount: "₹5,299.00",
                    status: "Succeeded",
                    time: "08:54 AM",
                  },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/80">
                    <td className="py-2 pr-3 text-slate-200">{row.merchant}</td>
                    <td className="py-2 pr-3 font-mono text-[11px] text-slate-300">
                      {row.id}
                    </td>
                    <td className="py-2 pr-3 text-slate-400">{row.type}</td>
                    <td className="py-2 pl-3 text-right text-slate-100">
                      {row.amount}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          row.status === "Succeeded"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : row.status === "Refunded"
                            ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                            : "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-right text-slate-400">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Small stat card component */
function StatCard({ label, value, pill, color }) {
  const colorMap = {
    emerald: "bg-emerald-500/5",
    sky: "bg-sky-500/5",
    amber: "bg-amber-500/5",
    rose: "bg-rose-500/5",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-400">{label}</p>
        {pill && (
          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-400">
            {pill}
          </span>
        )}
      </div>
      <p className="text-lg font-semibold">{value}</p>
      <div
        className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full ${colorMap[color]}`}
      />
    </div>
  );
}
