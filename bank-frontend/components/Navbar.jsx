"use client"; // For Next.js App Router

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className={`h-5 w-5 text-gray-700 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Navbar */}
      <nav
        className={`z-40 w-full border-b border-gray-200/60 bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 transition-all duration-500 ${
          isOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/20">
                <span className="text-lg font-bold text-white tracking-tight">
                  BT
                </span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">
                  BlueTrust Bank
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                  Calm • Secure • Modern
                </p>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <NavbarLink href="/" label="Dashboard" active />
              <NavbarLink href="/customers" label="Customers" />
              <NavbarLink href="/transactions" label="Transactions" />
              <NavbarLink href="/accounts" label="Accounts" />
              <NavbarLink href="/cards" label="Cards" />
              <NavbarLink href="/reports" label="Reports" />
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <button className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary-soft px-4 text-sm font-semibold text-primary shadow-sm hover:bg-primary-soft/80 hover:shadow-md transition-all duration-200">
                Upgrade
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    Aman Gupta
                  </p>
                  <p className="text-xs text-gray-500">024819</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-sm font-semibold text-primary shadow-sm">
                  AG
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// Reusable navbar link component
function NavbarLink({ href, label, active = false }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex h-10 items-center px-4 text-sm font-semibold transition-all duration-200 ${
        active
          ? "text-primary bg-primary-soft shadow-sm"
          : "text-gray-700 hover:text-primary"
      }`}
    >
      {label}
      {!active && (
        <div className="absolute inset-0 rounded-2xl bg-primary-soft/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm -mx-4" />
      )}
      {active && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-light/20 blur-sm" />
      )}
    </a>
  );
}
