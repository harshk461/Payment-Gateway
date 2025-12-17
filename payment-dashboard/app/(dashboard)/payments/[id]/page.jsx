"use client";

import { usePaymentDetails } from "@/app/hooks/usePaymentDetails";
import { useParams } from "next/navigation";

const formatAmount = (amount, currency) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);

const formatDateTime = (iso) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const statusBadgeClasses = (status) => {
  if (status === "SUCCESS")
    return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
  if (status === "FAILED")
    return "bg-rose-500/10 text-rose-300 border border-rose-500/40";
  return "bg-amber-500/10 text-amber-200 border border-amber-500/40";
};

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const { payment, loading, error } = usePaymentDetails(id);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Loading payment details…
      </div>
    );
  }

  // ❌ Error state
  if (error || !payment) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Failed to load payment.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ---------- HEADER ---------- */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
              Payment
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              {payment.id}
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              Provider ref: {payment.providerReference}
            </p>
          </div>

          <span
            className={
              "inline-flex items-center rounded-full px-3 py-1 text-[11px] " +
              statusBadgeClasses(payment.status)
            }
          >
            {payment.status === "SUCCESS"
              ? "Succeeded"
              : payment.status === "FAILED"
              ? "Failed"
              : payment.status}
          </span>
        </div>
      </header>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
        {/* Top Info Cards */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Amount */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Amount</p>
            <p className="text-lg font-semibold">
              {formatAmount(payment.amount, payment.currency)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Collected via {payment.method}
            </p>
          </div>

          {/* Customer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Customer</p>
            <p className="text-sm font-medium">{payment.customer?.name}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {payment.customer?.email}
            </p>
          </div>

          {/* Attempts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Attempts</p>
            <p className="text-lg font-semibold">{payment.attempts}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Last update {formatDateTime(payment.updatedAt)}
            </p>
          </div>
        </section>

        {/* Layout: Left timeline + Right metadata */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
          {/* ---------- Left Side ---------- */}
          <div className="space-y-4">
            {/* Intent Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-3">
                Payment intent
              </h2>

              <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-slate-500">Intent ID</p>
                  <p className="font-mono text-[11px] break-all">
                    {payment.id}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500">Provider reference</p>
                  <p className="font-mono text-[11px] break-all">
                    {payment.providerReference}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500">Created at</p>
                  <p>{formatDateTime(payment.createdAt)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500">Last updated</p>
                  <p>{formatDateTime(payment.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-4">
                Timeline
              </h2>

              <ol className="relative border-s border-slate-800 pl-4 text-xs">
                {payment.timeline.map((item, idx) => (
                  <li key={idx} className="mb-4 last:mb-0">
                    <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border border-slate-900 bg-slate-950">
                      <div
                        className={`h-full w-full rounded-full ${
                          idx === payment.timeline.length - 1
                            ? "bg-emerald-400"
                            : "bg-slate-600"
                        }`}
                      />
                    </div>

                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {formatDateTime(item.at)}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-slate-300">{item.description}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---------- Right Side ---------- */}
          <div className="space-y-4">
            {/* Metadata */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-slate-200">
                  Raw metadata
                </h2>
                <span className="text-[11px] text-slate-500">
                  For debugging
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(payment.metadata, null, 2)}
                </pre>
              </div>
            </div>

            {/* Refund Placeholder */}
            <div className="rounded-2xl border border-dashed border-amber-500/60 bg-amber-500/5 p-4 md:p-5">
              <h2 className="text-sm font-medium text-amber-100 mb-2">
                Refunds
              </h2>
              <p className="text-[11px] text-amber-100/80 mb-3">
                Refund feature is not implemented yet.
              </p>
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-xs text-amber-100 opacity-70 cursor-not-allowed"
              >
                ↺ Issue refund (coming soon)
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
