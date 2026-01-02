"use client";

import { apiRequest } from "@/lib/api";
import { useState, useEffect } from "react";

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    customerId: "",
    accountType: "savings",
    initialDeposit: "",
    interestRate: "",
    branchId: "",
  });
  const [existingAccounts, setExistingAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchExistingAccounts = async (customerId) => {
    if (!customerId) {
      setExistingAccounts([]);
      return;
    }

    setLoadingAccounts(true);
    try {
      const response = await apiRequest.get(`/accounts/customer/${customerId}`);
      setExistingAccounts(response.accounts || response || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setExistingAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleCustomerIdChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, customerId: value });
    fetchExistingAccounts(value);
  };

  const generateAccountNumber = (branchId, accountType, sequenceNumber = 1) => {
    const branchCode = branchId.slice(-3).toUpperCase(); // MUM001 → MUM
    const typeCode = accountType.charAt(0).toUpperCase(); // savings → S
    const paddedSeq = sequenceNumber.toString().padStart(6, "0"); // 1 → 000001

    return `ACC${branchCode}${typeCode}${paddedSeq}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const payload = {
        customerId: formData.customerId,
        branchId: formData.branchId,
        accountNumber: generateAccountNumber(
          formData.branchId,
          formData.accountType,
          2254235352
        ),
        accountType: formData.accountType,
        accountStatus: "ACTIVE",
        balance: parseFloat(formData.initialDeposit) || 0,
        interestRate: parseFloat(formData.interestRate) || 0,
        openedDate: new Date().toISOString().split("T")[0], // Today
      };

      console.log("Creating account:", payload);

      const response = await apiRequest.post("/accounts", payload);

      setSubmitSuccess(true);
      // Reset form on success
      setFormData({
        customerId: "",
        accountType: "savings",
        initialDeposit: "",
        interestRate: "",
        branchId: "",
      });
      setExistingAccounts([]);
    } catch (error) {
      console.error("Error creating account:", error);
      setSubmitError(
        error.response?.data?.message || "Failed to create account"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200/50 px-4 py-2 backdrop-blur-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-xs font-semibold text-sky-700">
                New account creation
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Create New Account
            </h1>
            <p className="text-xl text-gray-600">
              Open a new bank account with complete customer and branch details.
            </p>
          </div>

          <form
            id="account-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center text-sm font-semibold text-white">
                    1
                  </span>
                  Account Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Customer ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerId}
                      onChange={handleCustomerIdChange}
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="CUST001"
                    />
                    {loadingAccounts && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-sky-600">
                        <div className="h-4 w-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        Loading accounts...
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type *
                    </label>
                    <select
                      required
                      value={formData.accountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountType: e.target.value,
                        })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    >
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                      <option value="premium_savings">Premium Savings</option>
                      <option value="fixed_deposit">Fixed Deposit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.interestRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interestRate: e.target.value,
                        })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="4.2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Deposit *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.initialDeposit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initialDeposit: e.target.value,
                        })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="50000"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-sm font-semibold text-white">
                    2
                  </span>
                  Branch Details
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Branch ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.branchId}
                    onChange={(e) =>
                      setFormData({ ...formData, branchId: e.target.value })
                    }
                    className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="MUM001"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* New Account Preview */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  New Account Preview
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200/50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-sky-400 text-lg font-semibold text-white">
                      {formData.accountType.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 capitalize">
                        {formData.accountType || "Savings"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Customer: {formData.customerId || "CUST001"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Interest Rate</span>
                      <p className="font-semibold text-emerald-600">
                        {formData.interestRate || "4.2"}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Initial Deposit</span>
                      <p className="font-semibold text-blue-600">
                        ₹
                        {parseInt(
                          formData.initialDeposit || "0"
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Branch ID</span>
                      <p className="font-semibold text-purple-600">
                        {formData.branchId || "MUM001"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Opened Date</span>
                      <p className="font-semibold text-gray-900">
                        {new Date().toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Accounts Section */}
              {existingAccounts.length > 0 && (
                <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-8 backdrop-blur-xl shadow-2xl shadow-amber-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-sm font-semibold text-white">
                      !
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-amber-900">
                        Existing Accounts ({existingAccounts.length})
                      </h3>
                      <p className="text-sm text-amber-700">
                        Customer already has active accounts
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {existingAccounts.map((account) => (
                      <div
                        key={account.id || account.accountNumber}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-amber-200/50 hover:bg-white/80 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-sm font-semibold text-white">
                            {account.accountType?.charAt(0).toUpperCase() ||
                              "A"}
                          </div>
                          <div>
                            <p className="font-semibold text-amber-900 capitalize">
                              {account.accountType || "Account"}
                            </p>
                            <p className="text-xs text-amber-700">
                              {account.accountNumber || account.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600 text-sm">
                            ₹{parseInt(account.balance || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {account.branchId || account.branch || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Submit Feedback */}
          {submitSuccess && (
            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-lg font-semibold text-white">
                  ✓
                </span>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">
                    Account Created Successfully!
                  </h3>
                  <p className="text-emerald-700">
                    New account has been added for customer{" "}
                    {formData.customerId}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-400 flex items-center justify-center text-lg font-semibold text-white">
                  !
                </span>
                <div>
                  <h3 className="text-xl font-bold text-red-900">
                    Creation Failed
                  </h3>
                  <p className="text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-8 lg:pt-0">
            <button
              type="submit"
              form="account-form"
              disabled={
                loadingSubmit ||
                !formData.customerId ||
                !formData.branchId ||
                !formData.initialDeposit
              }
              className="flex-1 lg:flex-none h-14 rounded-3xl bg-gradient-to-r from-sky-500 to-sky-600 px-8 text-lg font-semibold text-white shadow-xl shadow-sky-500/25 hover:shadow-2xl hover:shadow-sky-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loadingSubmit ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  customerId: "",
                  accountType: "savings",
                  initialDeposit: "",
                  interestRate: "",
                  branchId: "",
                });
                setExistingAccounts([]);
                setSubmitError("");
                setSubmitSuccess(false);
              }}
              className="flex-1 lg:flex-none h-14 rounded-3xl border border-gray-200/60 bg-white/60 px-8 text-lg font-semibold text-gray-900 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-gray-300/60 transition-all"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
