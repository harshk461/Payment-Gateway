"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function CreateCardPage() {
  const [form, setForm] = useState({
    customerId: "",
    linkedAccount: "",
    network: "VISA",
    cardholderName: "",
    dailyLimit: "50000",
  });
  const [loading, setLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        customerId: form.customerId,
        accountId: form.linkedAccount,
        network: form.network,
        cardholderName: form.cardholderName.toUpperCase(),
        dailyLimit: parseFloat(form.dailyLimit),
        cardType: "debit",
      };

      // Backend generates: PAN, CVV, expiry, cardId
      const response = await apiRequest.post("/card", payload);

      setGeneratedCard(response.card);
      setSuccess(true);

      // Keep form data for re-generation
    } catch (error) {
      console.error("Error creating card:", error);
      alert(error.response?.data?.message || "Failed to create card");
    } finally {
      setLoading(false);
    }
  };

  // Network-specific card colors
  const networkColors = {
    VISA: {
      bg: "from-blue-600 via-blue-500 to-blue-400",
      chip: "bg-yellow-400/20",
    },
    MASTERCARD: {
      bg: "from-orange-500 via-orange-400 to-orange-300",
      chip: "bg-yellow-400/30",
    },
    RUPAY: {
      bg: "from-indigo-600 via-indigo-500 to-purple-500",
      chip: "bg-orange-400/20",
    },
    AMEX: {
      bg: "from-emerald-600 via-emerald-500 to-teal-500",
      chip: "bg-yellow-300/30",
    },
  };

  const currentNetwork = networkColors[form.network] || networkColors.VISA;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          {/* Header */}
          <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200/60 px-4 py-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-xs font-semibold text-purple-700">
                  Backend card generation
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Issue New Card
              </h1>
              <p className="text-xl text-gray-600">
                Backend will auto-generate secure PAN, CVV & expiry date.
              </p>
            </div>
            {success && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">
                  Card issued successfully
                </span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8"
          >
            {/* Left: Simplified form */}
            <div className="space-y-6">
              {/* Customer & Account */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center text-sm font-semibold text-white">
                    1
                  </span>
                  Customer & Account
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Customer ID *
                    </label>
                    <input
                      name="customerId"
                      value={form.customerId}
                      onChange={handleChange}
                      required
                      placeholder="CUST001"
                      className="w-full h-14 rounded-2xl border border-gray-200/60 bg-white/60 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Linked account *
                    </label>
                    <input
                      name="linkedAccount"
                      value={form.linkedAccount}
                      onChange={handleChange}
                      required
                      placeholder="ACCMUMS000001"
                      className="w-full h-14 rounded-2xl border border-gray-200/60 bg-white/60 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card network *
                    </label>
                    <select
                      name="network"
                      value={form.network}
                      onChange={handleChange}
                      className="w-full h-14 rounded-2xl border border-gray-200/60 bg-white/60 px-5 text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                    >
                      <option value="VISA">VISA</option>
                      <option value="MASTERCARD">MasterCard</option>
                      <option value="RUPAY">RuPay</option>
                      <option value="AMEX">American Express</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Daily limit (₹) *
                    </label>
                    <input
                      name="dailyLimit"
                      type="number"
                      value={form.dailyLimit}
                      onChange={handleChange}
                      required
                      min="1000"
                      max="500000"
                      placeholder="50000"
                      className="w-full h-14 rounded-2xl border border-gray-200/60 bg-white/60 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-sm font-semibold text-white">
                    2
                  </span>
                  Cardholder Details
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder name *
                  </label>
                  <input
                    name="cardholderName"
                    value={form.cardholderName}
                    onChange={handleChange}
                    required
                    placeholder="PRIYA SHARMA"
                    className="w-full h-14 rounded-2xl border border-gray-200/60 bg-white/60 px-5 text-lg uppercase tracking-wide placeholder:tracking-normal placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !form.customerId ||
                    !form.linkedAccount ||
                    !form.cardholderName
                  }
                  className="flex-1 h-14 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 text-lg font-semibold text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate & Issue Card"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      customerId: "",
                      linkedAccount: "",
                      network: "VISA",
                      cardholderName: "",
                      dailyLimit: "50000",
                    });
                    setGeneratedCard(null);
                    setSuccess(false);
                  }}
                  className="flex-1 h-14 rounded-3xl border border-gray-200/60 bg-white/70 px-8 text-lg font-semibold text-gray-900 shadow-lg hover:shadow-xl hover:shadow-gray-300/60 transition-all backdrop-blur-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Backend-generated preview */}
            <div className="lg:block">
              <div className="sticky top-24 space-y-6 self-start">
                {generatedCard ? (
                  <div
                    className={`rounded-3xl border border-white/20 bg-gradient-to-br ${currentNetwork.bg} p-8 text-white shadow-2xl shadow-black/30 backdrop-blur-xl overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

                    {/* Chip */}
                    <div
                      className={`absolute top-6 left-6 w-12 h-9 rounded-lg shadow-lg flex items-center justify-center ${currentNetwork.chip}`}
                    >
                      <div className="w-4 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-sm shadow-inner" />
                    </div>

                    {/* Network logo */}
                    <div
                      className={`absolute top-6 right-6 h-10 w-20 rounded-lg bg-black/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm shadow-lg`}
                    >
                      {form.network === "MASTERCARD" ? "MC" : form.network}
                    </div>

                    <div className="relative z-10 pt-6">
                      <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.3em] opacity-80">
                            BlueTrust Bank
                          </p>
                          <p className="text-xs opacity-70">
                            Linked: {form.linkedAccount}
                          </p>
                        </div>
                      </div>

                      <p className="mb-8 font-mono text-2xl tracking-[0.3em] leading-relaxed">
                        {generatedCard.cardNumber
                          .replace(/(\d{4})/g, "$1 ")
                          .trim()}
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-1">
                            Cardholder
                          </p>
                          <p className="text-base font-semibold tracking-wide leading-tight max-w-[140px] truncate">
                            {generatedCard.cardholderName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-1">
                            Expires
                          </p>
                          <p className="text-base font-semibold">
                            {String(generatedCard.expiryMonth).padStart(2, "0")}
                            /{String(generatedCard.expiryYear).slice(-2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl border-4 border-dashed border-white/30 bg-gradient-to-br ${currentNetwork.bg} p-12 text-white shadow-2xl shadow-black/20 backdrop-blur-xl text-center`}
                  >
                    <div className="w-20 h-14 mx-auto mb-6 rounded-lg shadow-lg flex items-center justify-center ${currentNetwork.chip}">
                      <div className="w-6 h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-sm shadow-inner" />
                    </div>
                    <p className="text-2xl font-mono tracking-[0.3em] mb-2">
                      **** **** **** ****
                    </p>
                    <p className="text-sm opacity-70">
                      Backend will generate secure card details
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center leading-relaxed space-y-1">
                  <p>🔒 PAN, CVV generated server-side with Luhn algorithm</p>
                  <p>✅ PCI-DSS compliant storage & transmission</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
