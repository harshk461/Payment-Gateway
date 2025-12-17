// app/sitemap/page.jsx
import React from "react";

const sections = [
  {
    title: "Merchant Dashboard",
    accent: "emerald",
    description:
      "Pages used by merchants to monitor payments and configure their account.",
    routes: [
      "/dashboard",
      "/dashboard/payments",
      "/dashboard/payments/[id]",
      "/dashboard/webhooks",
      "/dashboard/settings/profile",
      "/dashboard/settings/api-keys",
      "/dashboard/settings/documentations",
    ],
  },
  {
    title: "Merchant Auth",
    accent: "emerald",
    description: "Authentication flows for merchants.",
    routes: ["/merchant/login", "/merchant/forgot-password"],
  },
  {
    title: "Admin",
    accent: "sky",
    description:
      "Admin-only controls for managing merchants and system health.",
    routes: [
      "/admin",
      "/admin/login",
      "/admin/forgot-password",
      "/admin/merchants",
      "/admin/merchants/register",
      "/admin/merchants/[merchantId]",
      "/admin/merchants/[merchantId]/payments",
      "/admin/merchants/[merchantId]/webhooks",
      "/admin/merchants/[merchantId]/settings",
    ],
  },
];

const accentMap = {
  emerald: "from-emerald-500/20 via-emerald-500/5 to-slate-900",
  sky: "from-sky-500/20 via-sky-500/5 to-slate-900",
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Hero */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-6 py-6 md:px-8 md:py-7 shadow-xl shadow-slate-950/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400/80 mb-1">
                Developer navigation
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                App sitemap
              </h1>
              <p className="mt-2 text-[11px] text-slate-400 max-w-xl">
                A high-level overview of all key routes in the payment gateway
                dashboard and admin console, grouped by responsibility.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Internal docs
              </span>
              <span className="text-slate-600">Last updated · today</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-6`}
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${
                  accentMap[section.accent]
                }`}
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-50">
                      {section.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-[10px] text-slate-300">
                    {section.routes.length} route
                    {section.routes.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3">
                  <ul className="space-y-1.5 text-xs">
                    {section.routes.map((route) => {
                      const exampleHref = route
                        .replace("[merchantId]", "12")
                        .replace("[id]", "pay_123");
                      const isDynamic = route.includes("[");
                      return (
                        <li
                          key={route}
                          className="flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition" />
                            <code className="font-mono text-[11px] text-slate-200 group-hover:text-emerald-300 transition">
                              {route}
                            </code>
                            {isDynamic && (
                              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-1.5 py-0.5 text-[9px] text-slate-400">
                                dynamic
                              </span>
                            )}
                          </div>
                          <a
                            href={exampleHref}
                            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-400 group-hover:border-emerald-500/70 group-hover:text-emerald-300 transition"
                          >
                            <span>Open</span>
                            <span>↗</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
