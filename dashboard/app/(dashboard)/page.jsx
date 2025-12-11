"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// app/dashboard/page.tsx
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // TODO: replace this with real auth check (cookies/JWT/API)
  const isMerchantLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("merchant_token") != null;
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!isMerchantLoggedIn()) {
        router.replace("/merchant/login");
      } else {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: title + breadcrumb */}
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              Overview
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                Payments Dashboard
              </h1>
              <span className="hidden md:inline-flex items-center text-[11px] text-slate-500 gap-1">
                <span className="text-slate-600">/</span>
                <span>Home</span>
              </span>
            </div>
          </div>

          {/* Right: live badge + settings/profile */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/80 hover:text-emerald-300 transition">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </button>

            <div className="h-6 w-px bg-slate-800/80" />

            {/* Settings button */}
            <a
              href="/dashboard/settings/profile"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-emerald-500/80 hover:text-emerald-300 transition"
            >
              <span className="text-[13px]">⚙️</span>
              <span>Settings</span>
            </a>

            {/* Avatar with small menu icon (can be wired later) */}
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-[11px] text-slate-300 hover:border-emerald-500/80 hover:text-emerald-300 transition">
              HS
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today’s volume */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Today&apos;s volume</p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                +12.4%
              </span>
            </div>
            <p className="text-lg font-semibold">₹1,24,560</p>
            <p className="mt-1 text-[11px] text-slate-500">
              184 payments processed today
            </p>
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-500/5" />
          </div>

          {/* Total volume */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Total volume</p>
              <span className="text-[10px] text-slate-500">All time</span>
            </div>
            <p className="text-lg font-semibold">₹2,87,43,920</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Across 38,294 payments
            </p>
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-sky-500/5" />
          </div>

          {/* Total payments */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Total payments</p>
              <span className="text-[10px] text-slate-500">Last 30 days</span>
            </div>
            <p className="text-lg font-semibold">4,392</p>
            <p className="mt-1 text-[11px] text-slate-500">
              3.4% higher than previous period
            </p>
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-purple-500/5" />
          </div>

          {/* Success rate */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Success rate</p>
              <span className="text-[10px] text-slate-500">Today</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-lg font-semibold">96.8%</p>
              <span className="text-[11px] text-emerald-400">+1.2%</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
              <div className="h-1.5 rounded-full bg-linear-to-r from-emerald-400 to-sky-400 w-[96.8%]" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              6 failed out of 190 attempts
            </p>
          </div>
        </section>

        {/* Revenue + extra KPIs */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Revenue chart card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-slate-200">Revenue</h2>
                <p className="text-[11px] text-slate-500">
                  Last 7 days · Daily revenue
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

            {/* Placeholder chart: swap with real chart.js / apexcharts later */}
            <div className="relative mt-2 h-48 rounded-xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 flex items-center justify-center">
              <p className="text-xs text-slate-500">
                Chart placeholder – render line/area chart here
              </p>
            </div>
          </div>

          {/* Revenue + success breakdown */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="text-sm font-medium text-slate-200 mb-3">
                Today&apos;s performance
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Today&apos;s revenue</span>
                  <span className="font-medium">₹1,24,560</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Successful payments</span>
                  <span>184</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Failed payments</span>
                  <span className="text-rose-400">6</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-slate-400 text-xs">
                    Average ticket size
                  </span>
                  <span className="text-sm font-medium">₹677.94</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-linear-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10 p-4 text-xs text-slate-200">
              <p className="font-medium mb-1">Gateway health</p>
              <p className="text-slate-300">
                Success rate is above 95%. You are in a healthy range compared
                to typical payment gateways.
              </p>
            </div>
          </div>
        </section>

        {/* Recent payments table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-slate-200">
                Recent payments
              </h2>
              <p className="text-[11px] text-slate-500">
                Latest 10 payments across all methods
              </p>
            </div>
            <button className="text-xs text-slate-400 hover:text-slate-100">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-left font-normal">Payment ID</th>
                  <th className="py-2 text-left font-normal">Customer</th>
                  <th className="py-2 text-left font-normal">Method</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                  <th className="py-2 text-left font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  {
                    id: "pay_1KJH78",
                    customer: "Rahul Sharma",
                    method: "UPI",
                    amount: "₹1,499.00",
                    status: "Success",
                    time: "2 min ago",
                  },
                  {
                    id: "pay_1KJH45",
                    customer: "Sneha Iyer",
                    method: "Card •••• 4242",
                    amount: "₹2,999.00",
                    status: "Success",
                    time: "12 min ago",
                  },
                  {
                    id: "pay_1KJG90",
                    customer: "Guest User",
                    method: "Netbanking",
                    amount: "₹899.00",
                    status: "Failed",
                    time: "25 min ago",
                  },
                  {
                    id: "pay_1KJG55",
                    customer: "Kunal Verma",
                    method: "Wallet",
                    amount: "₹349.00",
                    status: "Success",
                    time: "32 min ago",
                  },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/80">
                    <td className="py-2 pr-3 font-mono text-[11px] text-slate-300">
                      {row.id}
                    </td>
                    <td className="py-2 pr-3 text-slate-200">{row.customer}</td>
                    <td className="py-2 pr-3 text-slate-400">{row.method}</td>
                    <td className="py-2 pl-3 text-right text-slate-100">
                      {row.amount}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          row.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
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
