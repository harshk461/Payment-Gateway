"use client";

import { usePayments } from "@/app/hooks/usePayments";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function PaymentsListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { payments, total, loading } = usePayments({
    page,
    status,
    query,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleStatusChange = (next) => {
    setStatus(next);
    setPage(1);
  };

  const formatAmount = (amount, currency) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount / 100);

  const formatDate = (iso) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));

  const badgeClasses = (status) => {
    if (status.toLowerCase() === "succeeded")
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
    if (status.toLowerCase() === "failed")
      return "bg-rose-500/10 text-rose-300 border border-rose-500/40";
    return "bg-amber-500/10 text-amber-200 border border-amber-500/40";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <p className="text-[11px] uppercase text-emerald-400/80">Payments</p>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {/* Filters */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative w-full md:max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                🔍
              </span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by payment ID, reference..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2.5 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Status:</span>
            {["all", "succeeded", "failed", "processing", "created"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`rounded-full px-3 py-1 text-[11px] border ${
                    status === s
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-900 text-slate-400"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              )
            )}
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          {loading ? (
            <p className="text-center text-slate-500 py-6 text-xs">
              Loading payments…
            </p>
          ) : payments.length === 0 ? (
            <p className="text-center text-slate-500 py-6 text-xs">
              No payments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 text-left">Payment ID</th>
                    <th className="py-2 text-left">Method</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-right">Date</th>
                    <th className="py-2 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/80">
                      <td className="py-2 text-slate-300 font-mono">{p.id}</td>
                      <td className="py-2 text-slate-400">{p.connector}</td>
                      <td className="py-2 text-right">
                        {formatAmount(p.amount, p.currency)}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${badgeClasses(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 text-right text-slate-400">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-2 text-right">
                        <a
                          href={`/payments/${p.id.slice(4)}`}
                          className="px-2.5 py-1 border border-slate-700 rounded-full text-[10px] hover:border-emerald-500 hover:text-emerald-300"
                        >
                          View ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-4 flex justify-between text-[11px] text-slate-400">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-slate-700 rounded-full"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border border-slate-700 rounded-full"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
