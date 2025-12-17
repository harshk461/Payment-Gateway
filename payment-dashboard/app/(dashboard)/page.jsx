"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useGatewayHealth,
  useOverallStats,
  useRecentPayments,
  useRevenueChart,
  useTodayPerformance,
  useTodayStats,
} from "../hooks/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // check merchant login
  const isMerchantLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("merchant_token") != null;
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!isMerchantLoggedIn()) {
        router.replace("/merchant/login");
        return;
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [router]);

  // Fetch dashboard data
  const { stats: today } = useTodayStats();
  const { overall } = useOverallStats();
  const { chart } = useRevenueChart("7d");
  const { performance } = useTodayPerformance();
  const { payments } = useRecentPayments(10);
  const { health } = useGatewayHealth();

  if (loading || !today || !overall || !performance || !payments) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              Overview
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold">
                Payments Dashboard
              </h1>
              <span className="hidden md:inline-flex items-center text-[11px] text-slate-500 gap-1">
                <span className="text-slate-600">/</span>
                <span>Home</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </button>
            <div className="h-6 w-px bg-slate-800/80" />
            <a
              href="/dashboard/settings/profile"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300"
            >
              <span className="text-[13px]">⚙️</span> Settings
            </a>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-[11px] text-slate-300">
              HS
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* ------- TOP STATS ------- */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Volume */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Today’s volume</p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                +{today.growth}%
              </span>
            </div>
            <p className="text-lg font-semibold">₹{today.todayVolume}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {today.todayPayments} payments processed today
            </p>
          </div>

          {/* Total Volume */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Total volume</p>
            <p className="text-lg font-semibold">₹{overall.totalVolume}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Across {overall.totalPayments} payments
            </p>
          </div>

          {/* Total Payments */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Total payments</p>
            <p className="text-lg font-semibold">
              {overall.totalPayments.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Last 30 days: {overall.last30DaysPayments}
            </p>
          </div>

          {/* Success Rate */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Success rate</p>
            <p className="text-lg font-semibold">
              {today.todaySuccessRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {today.failedCount} failed today
            </p>
          </div>
        </section>

        {/* ------- PERFORMANCE & CHARTS ------- */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <h2 className="text-sm font-medium text-slate-200 mb-1">Revenue</h2>
            <p className="text-[11px] text-slate-500">Last 7 days</p>

            <div className="relative mt-3 h-48 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
              Chart placeholder (use chart.js or apexcharts)
            </div>
          </div>

          {/* Today Performance */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="text-sm font-medium mb-3">
                Today&apos;s performance
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Today&apos;s revenue</span>
                  <span className="font-medium">
                    ₹{performance.todayRevenue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Successful payments</span>
                  <span>{performance.successfulPayments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Failed payments</span>
                  <span className="text-rose-400">
                    {performance.failedPayments}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between">
                  <span className="text-slate-400 text-xs">
                    Avg ticket size
                  </span>
                  <span className="text-sm font-medium">
                    ₹{performance.avgTicketSize.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Gateway health */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="font-medium mb-1">Gateway health</p>
              <p className="text-slate-300">
                {health?.message} ({health?.successRate.toFixed(1)}%)
              </p>
            </div>
          </div>
        </section>

        {/* ------- RECENT PAYMENTS ------- */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <h2 className="text-sm font-medium text-slate-200 mb-1">
            Recent payments
          </h2>
          <p className="text-[11px] text-slate-500 mb-4">
            Latest 10 payments across all methods
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-left">Payment ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Method</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-right">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {payments.map((row) => (
                  <tr key={row.paymentId} className="hover:bg-slate-900/80">
                    <td className="py-2 pr-3 font-mono text-slate-300">
                      {row.paymentId}
                    </td>
                    <td className="py-2 pr-3 text-slate-200">{row.customer}</td>
                    <td className="py-2 pr-3 text-slate-400">{row.method}</td>
                    <td className="py-2 pl-3 text-right text-slate-100">
                      ₹{row.amount}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          row.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-right text-slate-400">
                      {row.timeAgo}
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
