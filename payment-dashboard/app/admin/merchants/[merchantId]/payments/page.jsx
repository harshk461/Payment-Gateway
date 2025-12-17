// app/admin/merchants/[merchantId]/payments/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const MOCK_PAYMENTS = [
  {
    id: "pay_1KJH78",
    amount: 149900,
    currency: "INR",
    status: "succeeded",
    method: "UPI",
    createdAt: "2025-12-11T10:12:00Z",
  },
  {
    id: "pay_1KJG90",
    amount: 89900,
    currency: "INR",
    status: "failed",
    method: "Netbanking",
    createdAt: "2025-12-11T09:30:00Z",
  },
];

const PAGE_SIZE = 10;

export default function AdminMerchantPaymentsPage() {
  const { merchantId } = useParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_PAYMENTS.filter((p) => {
      const matchesStatus = status === "all" || p.status === status;
      const matchesQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatAmount = (amount, currency) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);

  const formatDate = (iso) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));

  const badgeClasses = (s) =>
    s === "succeeded"
      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
      : s === "failed"
      ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
      : "bg-amber-500/10 text-amber-200 border border-amber-500/40";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin · Merchant #{merchantId}
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Merchant payments
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              All transactions routed through this merchant.
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

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {/* Filters */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by payment ID or method..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 pl-8 pr-3 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500">Status:</span>
            {["all", "succeeded", "failed", "processing"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s === "all" ? "all" : s);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-[11px] border transition ${
                  status === s
                    ? "border-sky-500/70 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-100"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400">
              Showing {paginated.length} of {filtered.length} payments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-left font-normal">Payment ID</th>
                  <th className="py-2 text-left font-normal">Method</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                  <th className="py-2 text-left font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Date</th>
                  <th className="py-2 text-right font-normal">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-slate-500 text-xs"
                    >
                      No payments for this merchant yet.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/80">
                      <td className="py-2 pr-3 font-mono text-[11px] text-slate-300">
                        {p.id}
                      </td>
                      <td className="py-2 pr-3 text-slate-400">{p.method}</td>
                      <td className="py-2 pl-3 text-right text-slate-100">
                        {formatAmount(p.amount, p.currency)}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${badgeClasses(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 pl-3 text-right text-slate-400">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-2 pl-3 text-right">
                        <a
                          href={`/payments/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-300 hover:border-sky-500 hover:text-sky-300 transition"
                        >
                          View
                          <span>↗</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
