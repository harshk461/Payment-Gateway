"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params?.accountId) {
      // ✅ Fixed: params.id not params.accountId
      fetchAccountDetails(params.accountId);
    }
  }, [params?.accountId]); // ✅ Fixed: dependency was params.id

  const fetchAccountDetails = async (accountId) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest.get(`/accounts/${accountId}`);
      setAccountData(response);
    } catch (err) {
      console.error("Error fetching account:", err);
      setError("Account not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-600">
          <div className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-semibold">
            Loading account details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Account not found"}
          </h1>
          <button
            onClick={() => router.push("/accounts")}
            className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-all"
          >
            Back to Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-400 text-xl font-bold text-white shadow-2xl shadow-sky-500/30 -mt-2">
                {accountData.type.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {accountData.id}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      accountData.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {accountData.status.toUpperCase()}
                  </span>
                  <span className="capitalize">{accountData.type}</span>
                  <span>Interest: {accountData.interestRate}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>Opened {accountData.opened}</span>
                  <span>Branch: {accountData.branch}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 self-end">
              <button className="h-12 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all">
                Deposit Funds
              </button>
              <button className="h-12 px-6 rounded-3xl border border-gray-200 bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl backdrop-blur transition-all">
                Freeze Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Balance cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 blur-sm" />
                  <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Current Balance
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      ₹{accountData.balance.toLocaleString()}
                    </p>
                    <p className="text-2xl font-semibold text-emerald-600">
                      Available: ₹
                      {accountData.availableBalance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="group relative rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all">
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Customer
                      </p>
                      <p className="font-bold text-xl">{accountData.holder}</p>
                      <p className="text-sm text-gray-500">
                        {accountData.holderId}
                      </p>
                    </div>
                    <a
                      href={`/customers/${accountData.holderId}`}
                      className="text-sky-600 hover:text-sky-800 font-semibold hover:underline transition-colors"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                  Recent Transactions
                  <a
                    href={`/accounts/${accountData.id}/transactions`}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-800 hover:underline transition-colors"
                  >
                    View all →
                  </a>
                </h3>
                <div className="space-y-4">
                  {(accountData?.transactions?.length > 0 &&
                    accountData.transactions?.map((txn) => (
                      <div
                        key={txn.id}
                        className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50/50 transition-all cursor-pointer"
                        onClick={() => router.push(`/transactions/${txn.id}`)}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold ${
                            txn.type === "credit"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {txn.type === "credit" ? "↑" : "↓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {txn.description}
                          </p>
                          <p className="text-sm text-gray-500">{txn.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-lg ${
                              txn.type === "credit"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {txn?.type === "credit" ? "+" : "-"}₹
                            {txn?.amount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))) || (
                    <div className="text-center py-8 text-gray-500">
                      No transactions found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Account Info
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type</span>
                    <div className="font-semibold capitalize">
                      {accountData.type}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Interest</span>
                    <div className="font-semibold text-emerald-600">
                      {accountData.interestRate}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 block ${
                        accountData.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {accountData.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Branch</span>
                    <div className="font-semibold">{accountData.branch}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
                    Transfer Funds
                  </button>
                  <button className="w-full h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 hover:shadow-lg transition-all backdrop-blur">
                    Download Statement
                  </button>
                  <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all">
                    Close Account
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
