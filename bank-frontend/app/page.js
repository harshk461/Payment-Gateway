'use client'
import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  const router=useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900 relative overflow-hidden">
      {/* Subtle floating elements */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute left-10 top-1/2 h-64 w-64 rounded-full bg-primary-soft/50 blur-3xl opacity-50 animate-pulse delay-1000" />

      <main className="relative z-10 flex min-h-screen items-center justify-center p-6 lg:p-12">
        <div className="max-w-7xl w-full space-y-12">
          {/* Hero section */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/50 px-4 py-2 backdrop-blur-sm mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">
                Live • Secure connection
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-primary bg-clip-text text-transparent mb-4 leading-tight">
              Good evening, Aman
            </h1>
            <p className="mx-auto max-w-2xl text-xl md:text-2xl text-gray-600 font-medium">
              Your banking dashboard. Calm, clear, and completely in control.
            </p>
          </div>

          {/* Premium feature cards grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Customers */}
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/10 to-primary-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Customers
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Customer Hub
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20">
                    <span className="text-xl">👥</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active customers</span>
                    <span className="text-2xl font-bold text-gray-900">1,248</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Growth</span>
                    <span className="text-lg font-semibold text-emerald-600">+4.8%</span>
                  </div>
                </div>

                <button className="group-hover/btn inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                onClick={()=>router.push("/customers")}>
                  View customers →
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-200/60">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Transactions
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Payment Flow
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-400 shadow-lg shadow-emerald-500/20 text-emerald-600">
                    <span className="text-xl">₹</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today&apos;s volume</span>
                    <span className="text-2xl font-bold text-gray-900">₹3.25M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success rate</span>
                    <span className="text-lg font-semibold text-emerald-600">98.2%</span>
                  </div>
                </div>

                <button className="group-hover/btn inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                onClick={()=>router.push("/transactions")}>
                  Track payments →
                </button>
              </div>
            </div>

            {/* Accounts */}
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-500 hover:-translate-y-2 hover:border-sky-200/60 md:col-span-2 xl:col-span-1">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Accounts
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Account Suite
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500/20 to-sky-400 shadow-lg shadow-sky-500/20 text-sky-600">
                    <span className="text-xl">🏦</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total balance</p>
                    <p className="text-3xl font-bold text-gray-900">₹8.42M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Deposits</p>
                    <p className="text-2xl font-bold text-gray-900">₹4.1M</p>
                  </div>
                </div>

                <button className="group-hover/btn inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                onClick={()=>router.push("/accounts")}>
                  Manage accounts →
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-500 hover:-translate-y-2 hover:border-purple-200/60">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Cards
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Card Center
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-400 shadow-lg shadow-purple-500/20 text-purple-600">
                    <span className="text-xl">💳</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active cards</span>
                    <span className="text-2xl font-bold text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly spend</span>
                    <span className="text-lg font-semibold text-gray-900">₹72K</span>
                  </div>
                </div>

                <button className="group-hover/btn inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                onClick={()=>router.push("/cards")}>
                  Manage cards →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
