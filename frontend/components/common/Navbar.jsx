"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] flex items-center justify-center text-white text-xs font-semibold">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">Shopwave</span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href={"/products"} className="hover:text-slate-900">
            New Arrivals
          </Link>
          <Link href={"/products"} className="hover:text-slate-900">
            Collections
          </Link>
          <Link href={"/products"} className="hover:text-slate-900">
            Deals
          </Link>
          <Link href={"/products"} className="hover:text-slate-900">
            Help
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div>
              <p>Hi, {user?.name || "User"}</p>
            </div>
          ) : (
            <Link
              type="button"
              href={"/auth/login"}
              className="hidden sm:inline-flex items-center rounded-full border border-slate-200 px-3 h-9 text-sm text-slate-700 hover:bg-slate-50"
            >
              Sign in
            </Link>
          )}

          <Link
            href={"/cart"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100"
          >
            <span className="text-[18px]">🛒</span>
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-[#22c55e] px-1.5 text-[10px] font-semibold text-white">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
