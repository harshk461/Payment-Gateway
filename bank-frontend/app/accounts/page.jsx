"use client";

import { apiRequest } from "@/lib/api";
import { useState, useEffect } from "react";

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("balance");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    activeCount: 0,
    avgInterest: 0,
  });

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get("/accounts");
      setAccounts(response.accounts || []);
      calculateStats(response.accounts || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = (accountList) => {
    const totalBalance = accountList.reduce(
      (sum, acc) => sum + (acc.balance || 0),
      0
    );
    const activeCount = accountList.filter(
      (acc) => acc.accountStatus === "ACTIVE"
    ).length;
    const avgInterest =
      accountList.length > 0
        ? (
            accountList.reduce((sum, acc) => sum + (acc.interestRate || 0), 0) /
            accountList.length
          ).toFixed(1)
        : 0;

    setStats({
      totalAccounts: accountList.length,
      totalBalance: totalBalance,
      activeCount: activeCount,
      avgInterest: avgInterest,
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      account.accountNumber?.includes(searchTerm) ||
      account.accountType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      account.accountStatus?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case "balance":
        return (b.balance || 0) - (a.balance || 0);
      case "recent":
        return (
          new Date(b.lastTransactionDate || 0).getTime() -
          new Date(a.lastTransactionDate || 0).getTime()
        );
      case "name":
        return (a.customer?.name || "").localeCompare(b.customer?.name || "");
      default:
        return 0;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumSignificantDigits: 3,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "frozen":
        return "bg-amber-100 text-amber-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-600">
          <div className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-semibold">Loading accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-6">
          {/* Page header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Account Management
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Manage {stats.totalAccounts} accounts across all customer
                portfolios
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/accounts/create"
                className="inline-flex h-12 items-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 transition-all"
              >
                + New Account
              </a>
              <button className="inline-flex h-12 items-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl">
                Bulk Actions
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-500/5 to-sky-400/5 opacity-0 group-hover:opacity-100 blur-sm" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Total Accounts
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalAccounts.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-400 text-white">
                  🏦
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Total Balance
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{formatCurrency(stats.totalBalance / 10000000)}Cr
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeCount}
                  <span className="text-sm text-emerald-600">
                    {" "}
                    {stats.totalAccounts > 0
                      ? (
                          (stats.activeCount / stats.totalAccounts) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Avg Interest
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.avgInterest}%
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/60 rounded-3xl border border-gray-200/50 p-6 backdrop-blur-xl shadow-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search accounts by ID, customer name, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200/50 bg-white/50 px-5 py-3 pl-12 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
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
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-gray-200/50 bg-white/50 px-4 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="frozen">Frozen</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-gray-200/50 bg-white/50 px-4 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              >
                <option value="balance">Balance (High-Low)</option>
                <option value="recent">Recent Activity</option>
                <option value="name">Customer Name</option>
              </select>
              <button
                onClick={fetchAccounts}
                className="h-12 px-6 rounded-2xl bg-sky-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:bg-sky-600 transition-all"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white/70 rounded-3xl border border-gray-200/50 shadow-2xl shadow-gray-200/40 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50 bg-white/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Interest
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Last Tx
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  {sortedAccounts.map((account) => (
                    <tr
                      key={account.id || account.accountNumber}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-400 text-sm font-semibold text-white">
                            {account.accountType?.charAt(0) || "A"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {account.accountNumber || account.id}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {account.accountType || "Account"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell font-semibold text-gray-900">
                        {account.customer?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-right">
                        <div className="font-mono font-bold text-2xl text-gray-900">
                          ₹{formatCurrency(account.balance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                          {account.interestRate || 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">
                        {account.lastTransactionDate
                          ? new Date(
                              account.lastTransactionDate
                            ).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              account.accountStatus
                            )}`}
                          >
                            {account.accountStatus || "Unknown"}
                          </span>
                          <a
                            href={`/accounts/${
                              account.id || account.accountNumber
                            }`}
                            className="text-sky-600 hover:text-sky-800 font-medium hover:underline transition-colors"
                          >
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sortedAccounts.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No accounts found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results count */}
          <div className="text-center text-sm text-gray-500 py-4">
            Showing {sortedAccounts.length} of {accounts.length} accounts
          </div>
        </div>
      </div>
    </div>
  );
}
