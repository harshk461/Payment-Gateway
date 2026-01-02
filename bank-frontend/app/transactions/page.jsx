"use client";

import { useState } from "react";

const transactions = [
  {
    id: "TXN001",
    date: "Today 3:42 PM",
    type: "credit",
    amount: 25000,
    customer: "Priya Sharma (CUST001)",
    account: "ACC001",
    description: "Salary - ABC Corporation",
    status: "completed",
  },
  {
    id: "TXN002",
    date: "Today 11:20 AM",
    type: "debit",
    amount: 1200,
    customer: "Rahul Patel (CUST002)",
    account: "ACC002",
    description: "Amazon India - Order #IN987654",
    status: "completed",
  },
  {
    id: "TXN003",
    date: "Yesterday 9:15 PM",
    type: "debit",
    amount: 50000,
    customer: "Aisha Khan (CUST003)",
    account: "ACC003",
    description: "Fixed Deposit Investment",
    status: "completed",
  },
  {
    id: "TXN004",
    date: "2 days ago 2:30 PM",
    type: "credit",
    amount: 8500,
    customer: "Priya Sharma (CUST001)",
    account: "ACC001",
    description: "Freelance Payment - Upwork",
    status: "pending",
  },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const filtered = transactions.filter((txn) =>
    `${txn.customer} ${txn.account} ${txn.id} ${txn.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Transactions
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Track all money movement across {transactions.length} recent
                transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex h-12 items-center gap-2 rounded-3xl bg-emerald-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl">
                Export report
              </button>
              <button className="inline-flex h-12 items-center gap-2 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl">
                Bulk actions
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 blur-sm" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900">₹12.4L</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
                  ↑
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">98.7%</p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Failed
                </p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-gray-300/60 transition-all hover:-translate-y-1">
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white/60 rounded-3xl border border-gray-200/50 p-6 backdrop-blur-xl shadow-lg">
            <div className="relative lg:col-span-2">
              <input
                type="text"
                placeholder="Search by customer, account, ID, or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200/50 bg-white/50 px-5 py-3 pl-12 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 rounded-2xl border border-gray-200/50 bg-white/50 px-4 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Reversed</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-32 rounded-2xl border border-gray-200/50 bg-white/50 px-3 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option>Today</option>
                <option>7 days</option>
                <option>30 days</option>
              </select>
            </div>
          </div>

          {/* Transactions table */}
          <div className="bg-white/70 rounded-3xl border border-gray-200/50 shadow-2xl shadow-gray-200/40 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50 bg-white/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Transaction
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Account
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  {filtered.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold ${
                              txn.type === "credit"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {txn.type === "credit" ? "↑" : "↓"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">
                              {txn.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {txn.date}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <div className="font-semibold text-gray-900">
                          {txn.customer}
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell text-sm text-gray-700">
                        {txn.account}
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell text-right">
                        <div
                          className={`text-2xl font-bold ${
                            txn.type === "credit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.type === "credit" ? "+" : "-"}₹
                          {txn.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              txn.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {txn.status}
                          </span>
                          <a
                            href={`/transactions/${txn.id}`}
                            className="text-primary hover:text-primary-light font-medium text-sm"
                          >
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
