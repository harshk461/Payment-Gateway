"use client";

import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const fetchAllCustomers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(sortBy !== "recent" && { sort: sortBy }),
        });

        const response = await apiRequest.get(`/customer?${params}`);

        if (response) {
          setCustomers(response.customers || []);
          setAnalytics(response.analytics || {});
          setMeta(response.meta || {});
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter, sortBy]
  );

  useEffect(() => {
    fetchAllCustomers(currentPage);
  }, [fetchAllCustomers, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const getKycBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-6">
          {/* Page header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Customer Management
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Monitor, manage, and support your{" "}
                {analytics?.totalCustomers || 0} active customers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex h-12 items-center gap-2 rounded-3xl bg-emerald-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200">
                + Invite customer
              </button>
              <button className="inline-flex h-12 items-center gap-2 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200">
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats cards - ✅ FIXED with actual API data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Total
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics?.totalCustomers || 0}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
                  👥
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Verified KYC
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.totalKYCVerified || 0}{" "}
                  <span className="text-sm font-normal text-emerald-600">
                    ({analytics?.kycVerifiedPercent || "0%"})
                  </span>
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.totalActive || 0}
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Transactions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.reduce(
                    (sum, c) => sum + (c.totalTransactions || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/60 rounded-3xl border border-gray-200/50 p-6 backdrop-blur-xl shadow-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search customers by name, email, customer ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full rounded-2xl border border-gray-200/50 bg-white/50 px-5 py-3 pl-12 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
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
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-2xl border border-gray-200/50 bg-white/50 px-4 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="all">All KYC Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-2xl border border-gray-200/50 bg-white/50 px-4 py-3 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="recent">Most Recent</option>
                <option value="transactions">Most Active</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Customers Table - ✅ FIXED with actual API fields */}
          <div className="bg-white/70 rounded-3xl border border-gray-200/50 shadow-2xl shadow-gray-200/40 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50 bg-white/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      KYC Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                      Transactions
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-sm font-semibold text-white">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.customerId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycBadgeClass(
                            customer.kycStatus
                          )}`}
                        >
                          {customer.kycStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="font-semibold text-gray-900">
                          {customer.branchName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-500">
                        {formatDate(customer.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-500">
                        {customer.lastLoginAt
                          ? formatDate(customer.lastLoginAt)
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {customer.totalTransactions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-weight-500">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getKycBadgeClass(
                              customer.kycStatus
                            )}`}
                          >
                            {customer.kycStatus?.toUpperCase()}
                          </span>
                          <button
                            className="text-primary hover:text-primary-dark font-medium"
                            onClick={() =>
                              router.push(`/customers/${customer.id}`)
                            }
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {customers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gray-100 mb-4">
                  👥
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No customers found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSortBy("recent");
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading customers...</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white/60 rounded-3xl border border-gray-200/50 p-6 backdrop-blur-xl shadow-lg">
              <div className="text-sm text-gray-600">
                Showing {meta.total || 0} of {meta.total || 0} customers
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="h-10 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {meta.totalPages || 1}
                </span>
                <button
                  disabled={currentPage === meta.totalPages || loading}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, meta.totalPages || 1)
                    )
                  }
                  className="h-10 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
