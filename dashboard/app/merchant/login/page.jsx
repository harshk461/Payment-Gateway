"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MerchantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      type: "MERCHANT",
      email,
      password,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      body
    );

    console.log(response);

    if (response.data) {
      localStorage.setItem("merchant_token", response.data.token);
      router.replace("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-xl shadow-slate-950/60">
        <div className="mb-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
            Merchant
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Sign in to your account
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            Access your payments dashboard and webhooks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70"
              placeholder="you@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-slate-300">Password</label>
              <a
                href="/merchant/forgot-password"
                className="text-[11px] text-emerald-400 hover:text-emerald-300"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-emerald-500 text-slate-950 py-2.5 text-sm font-medium hover:bg-emerald-400 shadow-lg shadow-emerald-500/40 transition"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          Don&apos;t have a merchant account?{" "}
          <Link
            href="/admin/merchants/register"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Ask admin to onboard you
          </Link>
        </p>
      </div>
    </div>
  );
}
