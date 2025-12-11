// app/admin/login/page.tsx
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call /auth/admin/login
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-xl shadow-slate-950/60">
        <div className="mb-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400/80">
            Admin
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Admin console login
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            Manage merchants, keys, and system configuration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              placeholder="admin@payments.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-slate-300">Password</label>
              <a
                href="/admin/forgot-password"
                className="text-[11px] text-sky-400 hover:text-sky-300"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-sky-500 text-slate-950 py-2.5 text-sm font-medium hover:bg-sky-400 shadow-lg shadow-sky-500/40 transition"
          >
            Sign in as admin
          </button>
        </form>
      </div>
    </div>
  );
}
