// app/admin/merchants/[merchantId]/webhooks/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const MOCK_LOGS = [
  {
    id: "log_1",
    eventType: "payment.succeeded",
    status: "delivered",
    attempts: 1,
    lastSentAt: "2025-12-11T09:35:00Z",
    payload: { intentId: 94, amount: 50000, currency: "INR" },
  },
  {
    id: "log_2",
    eventType: "payment.failed",
    status: "failed",
    attempts: 3,
    lastSentAt: "2025-12-11T09:20:00Z",
    payload: { intentId: 94 },
  },
];

const formatDateTime = (iso) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const statusBadgeClasses = (status) =>
  status === "delivered"
    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
    : status === "failed"
    ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
    : "bg-amber-500/10 text-amber-200 border border-amber-500/40";

export default function AdminMerchantWebhooksPage() {
  const { merchantId } = useParams();
  const [selectedId, setSelectedId] = useState(MOCK_LOGS[0]?.id);

  const selected =
    MOCK_LOGS.find((log) => log.id === selectedId) ?? MOCK_LOGS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sky-400/80">
              Admin · Merchant #{merchantId}
            </p>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Webhook logs
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              Delivery attempts and payloads for this merchant&apos;s webhook.
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
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          {/* Logs table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">
                Recent webhook deliveries
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 text-left font-normal">Event type</th>
                    <th className="py-2 text-center font-normal">Attempts</th>
                    <th className="py-2 text-left font-normal">Status</th>
                    <th className="py-2 text-right font-normal">
                      Last sent time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {MOCK_LOGS.map((log) => (
                    <tr
                      key={log.id}
                      className={`cursor-pointer ${
                        selectedId === log.id
                          ? "bg-slate-900"
                          : "hover:bg-slate-900/70"
                      }`}
                      onClick={() => setSelectedId(log.id)}
                    >
                      <td className="py-2 pr-3 text-slate-200">
                        {log.eventType}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-100">
                        {log.attempts}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${statusBadgeClasses(
                            log.status
                          )}`}
                        >
                          {log.status === "delivered"
                            ? "Delivered"
                            : log.status === "failed"
                            ? "Failed"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="py-2 pl-3 text-right text-slate-400">
                        {formatDateTime(log.lastSentAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payload panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-slate-200">Payload</h2>
                <span className="text-[11px] text-slate-500">
                  Event: {selected.eventType}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 text-xs text-slate-300 space-y-2">
              <h3 className="text-sm font-medium text-slate-200 mb-1">
                Delivery info
              </h3>
              <p>
                <span className="text-slate-500">Attempts: </span>
                <span>{selected.attempts}</span>
              </p>
              <p>
                <span className="text-slate-500">Last sent: </span>
                <span>{formatDateTime(selected.lastSentAt)}</span>
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Use these logs to debug signature issues, timeouts, and merchant
                webhook failures.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
