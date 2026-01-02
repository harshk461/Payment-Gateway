"use client";

import { apiRequest } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest.get(`/customer/${customerId}`);

      if (data) {
        console.log("Customer data:", data);
        setCustomerData(data);
      }
    } catch (err) {
      console.error("Customer fetch error:", err);
      setError(err.message || "Failed to fetch customer data");
      toast.error("Something went wrong while fetching customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-red-100 text-red-600 mb-6">
            !
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Customer Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            {error || "Customer data not available"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchCustomerData}
              className="h-12 px-6 rounded-2xl bg-primary text-white font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="h-12 px-6 rounded-2xl border border-gray-200 bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-light text-xl font-bold text-white shadow-2xl shadow-primary/30 -mt-2">
                {customerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {customerData.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getKycBadgeClass(
                      customerData.kycStatus
                    )}`}
                  >
                    {customerData.kycStatus}
                  </span>
                  <span>ID: {customerData.customerId}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>Joined {formatDate(customerData.joinedAt)}</span>
                  <span>Last seen {formatDate(customerData.lastLoginAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="h-12 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all">
                Send Message
              </button>
              <button className="h-12 px-6 rounded-3xl border border-gray-200 bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl hover:shadow-gray-300/60 transition-all backdrop-blur">
                Suspend Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main profile info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Balance & Stats - ✅ FIXED with actual API data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 blur-sm" />
                  <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Total Balance
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      ₹{customerData.accounts.totalBalance.toLocaleString()}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">
                      {customerData.accounts.count}{" "}
                      {customerData.accounts.count === 1
                        ? "account"
                        : "accounts"}
                    </p>
                  </div>
                </div>

                <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all">
                  <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Total Transactions
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {customerData.totalTransactions}
                    </p>
                  </div>
                </div>

                <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all">
                  <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Avg Transaction
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{customerData.avgTransactionAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accounts Table */}
              {customerData.accounts.details.length > 0 && (
                <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50 overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Accounts
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200/50 bg-white/50">
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Account
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Balance
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/30">
                        {customerData.accounts.details.map((account) => (
                          <tr
                            key={account.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {account.accountNumber}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {account.accountType}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="text-2xl font-bold text-emerald-600">
                                ₹{account.balance?.toLocaleString() || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  account.accountStatus === "active"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {account.accountStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Profile sidebar */}
            <div className="space-y-6">
              {/* Contact Info - ✅ FIXED with nested address */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Contact Info
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <div className="font-semibold text-gray-900 mt-1">
                      {customerData.email}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <div className="font-semibold text-gray-900 mt-1">
                      {customerData.phone}
                    </div>
                  </div>
                  {customerData.address && (
                    <div>
                      <span className="text-gray-500 block">Address</span>
                      <div className="font-semibold text-gray-900 mt-1">
                        {customerData.address.addressLine1}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {customerData.address.city},{" "}
                        {customerData.address.state} -{" "}
                        {customerData.address.pinCode}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <button className="w-full h-12 rounded-2xl bg-primary-soft px-4 text-sm font-semibold text-primary hover:bg-primary-soft/80 shadow-sm hover:shadow-md transition-all">
                    View Full Transaction History
                  </button>
                  <button className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 hover:shadow-lg transition-all backdrop-blur">
                    Update KYC Documents
                  </button>
                  <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all">
                    Transfer Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
