"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

export default function CardsPage() {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    activeCount: 0,
    activePercentage: 0,
    avgUtilization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get("/card");
      setCards(response.cards || []);
      setStats(response.stats || {});
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = cards.filter((card) =>
    `${card.customer} ${card.customerId} ${card.id} ${card.network} ${card.last4}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-semibold">Loading cards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Cards Management
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Track and manage {stats.totalCards?.toLocaleString() || 0}{" "}
                issued cards
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/cards/create"
                className="inline-flex h-12 items-center gap-2 rounded-3xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
              >
                + Issue new card
              </a>
              <button
                onClick={fetchCards}
                className="h-12 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 to-purple-400/5 opacity-0 group-hover:opacity-100 blur-sm" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Total Cards
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCards?.toLocaleString() || 0}
                </p>
              </div>
            </div>
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeCount?.toLocaleString() || 0}{" "}
                  <span className="text-sm text-emerald-600">
                    ({stats.activePercentage || 0}%)
                  </span>
                </p>
              </div>
            </div>
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Avg Utilization
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.avgUtilization || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/60 rounded-3xl border border-gray-200/50 p-6 backdrop-blur-xl shadow-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by customer, card ID, last 4, or network…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200/50 bg-white/50 px-5 py-3 pl-12 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Cards table */}
          <div className="bg-white/70 rounded-3xl border border-gray-200/50 shadow-2xl shadow-gray-200/40 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50 bg-white/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Card
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Linked Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Network
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Daily Limit
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  {filtered.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-xs font-semibold text-white tracking-widest shadow-lg">
                            •••• {card.last4}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {card.id}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {card.network.replace("MasterCard", "Mastercard")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="font-semibold text-gray-900">
                          {card.customer}
                        </div>
                        <div className="text-xs text-gray-500">
                          {card.customerId}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-700 font-mono">
                        {card.linkedAccount}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs font-semibold rounded-full">
                          {card.network.replace("MasterCard", "Mastercard")}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-right">
                        <div className="font-mono font-semibold text-lg text-gray-900">
                          ₹{formatCurrency(card.limit)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {card.utilization}% utilized
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              card.status
                            )}`}
                          >
                            {card.status}
                          </span>
                          <a
                            href={`/cards/${card.id}`}
                            className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors"
                          >
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No cards found matching "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 py-6">
            Showing {filtered.length} of {cards.length} cards
          </div>
        </div>
      </div>
    </div>
  );
}
