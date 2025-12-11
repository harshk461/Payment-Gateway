// app/admin/merchants/page.tsx
"use client";

import { useMemo, useState } from "react";

const MOCK_MERCHANTS = [
  {
    id: 12,
    name: "Harsh",
    businessName: "Harsh Store",
    email: "harsh@example.com",
    status: "ACTIVE",
    volume: 2874392000,
    apiErrors: 3,
    webhookFailures: 1,
  },
  {
    id: 34,
    name: "Acme",
    businessName: "Acme Technologies Pvt. Ltd.",
    email: "ops@acme.io",
    status: "ACTIVE",
    volume: 1540099000,
    apiErrors: 0,
    webhookFailures: 5,
  },
  {
    id: 56,
    name: "Nova",
    businessName: "Nova Fashion",
    email: "billing@novafashion.com",
    status: "SUSPENDED",
    volume: 329990000,
    apiErrors: 18,
    webhookFailures: 12,
  },
  {
    id: 78,
    name: "Krypton",
    businessName: "Krypton Digital",
    email: "pay@krypton.app",
    status: "ACTIVE",
    volume: 509900000,
    apiErrors: 1,
    webhookFailures: 0,
  },
];

const PAGE_SIZE = 10;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount / 100);

export default function AdminMerchantsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_MERCHANTS.filter((m) => {
      const matchesStatus = status === "all" || m.status === status;
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.businessName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusBadge = (s) =>
    s === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
      : "bg-amber-500/10 text-amber-200 border border-amber-500/40";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Merchant management
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              View all merchants, filter by status, and monitor health.
            </p>
          </div>
          <a
            href="/admin/merchants/register"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] text-sky-100 hover:bg-sky-500/20 transition"
          >
            <span>＋</span>
            <span>New merchant</span>
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
              placeholder="Search by merchant name, business, or email..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 pl-8 pr-3 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500">Status:</span>
            {["all", "ACTIVE", "SUSPENDED"].map((s) => (
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
              Showing {paginated.length} of {filtered.length} merchants
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-left font-normal">Merchant</th>
                  <th className="py-2 text-left font-normal">Email</th>
                  <th className="py-2 text-left font-normal">Status</th>
                  <th className="py-2 text-right font-normal">
                    Volume (lifetime)
                  </th>
                  <th className="py-2 text-center font-normal">API errors</th>
                  <th className="py-2 text-center font-normal">
                    Webhook failures
                  </th>
                  <th className="py-2 text-right font-normal">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-slate-500 text-xs"
                    >
                      No merchants match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/80">
                      <td className="py-2 pr-3">
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-sm">
                            {m.businessName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {m.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-slate-300">{m.email}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${statusBadge(
                            m.status
                          )}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-2 pl-3 text-right text-slate-100">
                        {formatCurrency(m.volume)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[2.2rem] rounded-full px-2 py-0.5 text-[10px] ${
                            m.apiErrors > 5
                              ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                              : m.apiErrors > 0
                              ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                              : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {m.apiErrors}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[2.2rem] rounded-full px-2 py-0.5 text-[10px] ${
                            m.webhookFailures > 5
                              ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                              : m.webhookFailures > 0
                              ? "bg-amber-500/10 text-amber-200 border border-amber-500/40"
                              : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {m.webhookFailures}
                        </span>
                      </td>
                      <td className="py-2 pl-3 text-right">
                        <a
                          href={`/admin/merchants/${m.id}`}
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

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-400">
            <p>
              Page {page} of {totalPages}
            </p>
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`rounded-full px-3 py-1 border text-xs transition ${
                  page === 1
                    ? "border-slate-800 text-slate-600 cursor-not-allowed"
                    : "border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-300"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 rounded-full text-xs transition ${
                      page === p
                        ? "bg-sky-500 text-slate-950"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`rounded-full px-3 py-1 border text-xs transition ${
                  page === totalPages
                    ? "border-slate-800 text-slate-600 cursor-not-allowed"
                    : "border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
