"use client";

import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest.post("/auth/login", formData);

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        router.replace("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-scree relative overflow-hidden">
      {/* subtle gradient orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/30 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-primary-light/25 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-primary-soft/40 blur-3xl opacity-70" />

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pb-10 pt-4 lg:px-10">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          {/* Left side: copy + highlights + mock card */}
          <section className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Protected with bank‑grade security
              </p>

              <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-slate-50 md:text-4xl">
                Sign in to a dashboard that feels calm, clear, and in control.
              </h1>

              <p className="mt-3 max-w-md text-sm text-slate-300">
                Track balances, payments, and investments in one focused view
                with real‑time alerts and intelligent insights designed to keep
                your money safe.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-slate-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                256‑bit TLS encryption
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
                RBI‑compliant security controls
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
                Intelligent fraud & risk monitoring
              </div>
            </div>

            {/* small floating stats card to make it feel premium */}
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-100 shadow-lg shadow-black/40 backdrop-blur">
              <div>
                <p className="text-[11px] text-slate-300">Total balance</p>
                <p className="text-sm font-semibold text-white">
                  ₹ 8,42,150.23
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-[11px] text-slate-300">This month</p>
                <p className="text-xs font-medium text-emerald-300">
                  + ₹ 32,410.00
                </p>
              </div>
            </div>
          </section>
          {/* Right side: stylish login card */}
          <section className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* glow behind card */}
              <div className="absolute inset-0 -z-10 scale-110 rounded-3xl bg-gradient-to-br from-primary/35 via-primary-light/20 to-sky-400/20 opacity-70 blur-2xl" />

              <div className="rounded-3xl border border-white/15 bg-white/10 px-7 py-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-semibold text-slate-50">
                      Welcome back
                    </h2>
                    <p className="mt-1 text-xs text-slate-300">
                      Sign in with your customer ID to access your BlueTrust
                      dashboard.
                    </p>
                  </div>
                  <div className="flex h-8 items-center gap-1 rounded-full bg-black/30 px-3 text-[11px] text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Secure session
                  </div>
                </div>

                <form className="mt-3 space-y-3.5" onSubmit={handleSubmit}>
                  {/* Customer ID */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="customerId"
                      className="text-[12px] font-medium text-slate-200"
                    >
                      Customer ID
                    </label>
                    <div className="relative">
                      <input
                        id="customerId"
                        type="text"
                        placeholder="Enter your registered ID"
                        className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 text-[13px] text-slate-50 placeholder:text-slate-400 outline-none backdrop-blur-sm transition focus:border-primary-light focus:ring-2 focus:ring-primary-light/60 focus:ring-offset-0"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-[11px] text-slate-400">
                        CID
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-[12px] font-medium text-slate-200"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-[11px] text-primary-light underline underline-offset-2 hover:text-sky-400"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 pr-10 text-[13px] text-slate-50 placeholder:text-slate-400 outline-none backdrop-blur-sm transition focus:border-primary-light focus:ring-2 focus:ring-primary-light/60 focus:ring-offset-0"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 inline-flex items-center px-2 text-[11px] text-slate-300 hover:text-slate-100"
                        onClick={handleSubmit}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  {/* Remember / device */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-2 text-[12px] text-slate-200">
                      <input
                        type="checkbox"
                        className="h-[14px] w-[14px] rounded-[4px] border border-white/30 bg-black/30 text-primary focus:ring-primary-light focus:ring-2 focus:ring-offset-0"
                      />
                      <span>Remember this device</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Last login • Today, 09:42 PM
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-primary-light to-sky-400 text-[13px] font-medium text-slate-50 shadow-lg shadow-primary/40 transition hover:brightness-110 active:translate-y-[1px] active:shadow-md"
                  >
                    Sign in securely
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[11px] text-slate-400">or</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Secondary CTA */}
                  <button
                    type="button"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/30 text-[12px] font-medium text-slate-100 backdrop-blur-sm transition hover:bg-black/40"
                  >
                    Open a new account
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-slate-400">
                  By continuing, you agree to BlueTrust’s{" "}
                  <button className="underline underline-offset-2 hover:text-slate-200">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button className="underline underline-offset-2 hover:text-slate-200">
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
