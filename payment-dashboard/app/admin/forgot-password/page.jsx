// app/admin/forgot-password/page.tsx
"use client";

import { useState } from "react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call /auth/admin/forgot-password
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-xl shadow-slate-950/60">
        <div className="mb-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400/80">
            Admin
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Forgot admin password
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            Enter your admin email to receive a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-slate-300 mb-1.5">
              Admin email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              placeholder="admin@payments.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 text-slate-950 py-2.5 text-sm font-medium hover:bg-sky-400 shadow-lg shadow-sky-500/40 transition"
          >
            Send reset link
          </button>
        </form>

        {sent && (
          <p className="mt-3 text-[11px] text-sky-300 text-center">
            If an admin account exists for this email, a reset link has been
            sent.
          </p>
        )}

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          Back to{" "}
          <a href="/admin/login" className="text-sky-400 hover:text-sky-300">
            admin login
          </a>
        </p>
      </div>
    </div>
  );
}
