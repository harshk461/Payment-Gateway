"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params?.cardId) {
      fetchCardDetails(params.cardId);
    }
  }, [params?.cardId]);

  const fetchCardDetails = async (cardId) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest.get(`/card/${cardId}`);
      setCardData(response);
    } catch (err) {
      console.error("Error fetching card:", err);
      setError("Card not found");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-600">
          <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-semibold">Loading card details...</span>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Card not found"}
          </h1>
          <button
            onClick={() => router.push("/cards")}
            className="px-6 py-3 rounded-2xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          >
            Back to Cards
          </button>
        </div>
      </div>
    );
  }

  // Network-specific colors
  const networkColors = {
    VISA: "from-blue-600 via-blue-500 to-blue-400",
    MASTERCARD: "from-orange-500 via-orange-400 to-orange-300",
    RUPAY: "from-indigo-600 via-indigo-500 to-purple-500",
    AMEX: "from-emerald-600 via-emerald-500 to-teal-500",
  };
  const cardColor =
    networkColors[cardData.network] ||
    "from-purple-500 via-purple-600 to-purple-700";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div
                className={`rounded-3xl border border-white/30 bg-gradient-to-br ${cardColor} p-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl`}
              >
                <p className="font-mono text-sm tracking-[0.25em]">
                  •••• {cardData.last4}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] opacity-90">
                  {cardData.network}
                </p>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {cardData.id}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      cardData.status
                    )}`}
                  >
                    {cardData.status.toUpperCase()}
                  </span>
                  <span>{cardData.network}</span>
                  <span>Daily Limit: ₹{formatCurrency(cardData.limit)}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Issued to{" "}
                  <span className="font-semibold">
                    {cardData.cardholderName}
                  </span>
                  , linked to{" "}
                  <a
                    href={`/accounts/${cardData.linkedAccount}`}
                    className="font-mono text-purple-600 hover:underline"
                  >
                    {cardData.linkedAccount}
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 self-end">
              <button className="h-11 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all">
                Temporarily Lock
              </button>
              <button className="h-11 px-6 rounded-3xl border border-gray-200 bg-white text-gray-900 text-sm font-semibold shadow-lg hover:shadow-xl backdrop-blur transition-all">
                Replace Card
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
            {/* Left: main info */}
            <div className="space-y-8">
              {/* Full card mock */}
              <div
                className={`rounded-3xl border border-white/30 bg-gradient-to-br ${cardColor} p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-xl overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

                {/* Chip */}
                <div className="absolute top-6 left-6 w-12 h-9 rounded-lg shadow-lg bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <div className="w-4 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-sm shadow-inner" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                        BlueTrust Bank • {cardData.network}
                      </p>
                      <p className="mt-1 text-xs opacity-70">
                        Account: {cardData.linkedAccount}
                      </p>
                    </div>
                    <div className="h-10 w-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs font-bold tracking-wide">
                      {cardData.network === "MASTERCARD"
                        ? "MC"
                        : cardData.network}
                    </div>
                  </div>

                  <p className="mb-6 font-mono text-lg tracking-[0.25em] leading-relaxed">
                    •••• •••• •••• {cardData.last4}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] opacity-70">
                        Cardholder
                      </p>
                      <p className="text-sm font-semibold tracking-wide">
                        {cardData.cardholderName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.15em] opacity-70">
                        Valid thru
                      </p>
                      <p className="text-sm font-semibold">{cardData.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limits & utilization */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Daily Limit & Usage
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Available</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      ₹{formatCurrency(cardData.available)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm text-gray-500">
                    <span>Total limit</span>
                    <span>₹{formatCurrency(cardData.limit)}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm text-gray-500">
                    <span>Utilization</span>
                    <span className="font-semibold text-gray-900">
                      {cardData.utilization}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(cardData.utilization, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: meta & actions */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Card Information
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Customer</span>
                    <p className="font-semibold">{cardData.customer}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {cardData.customerId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">
                      Linked account
                    </span>
                    <a
                      href={`/accounts/${cardData.linkedAccount}`}
                      className="font-mono font-semibold text-purple-600 hover:underline"
                    >
                      {cardData.linkedAccount}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Network</span>
                    <span className="inline-flex px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold rounded-full">
                      {cardData.network}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Cardholder</span>
                    <p className="font-semibold uppercase tracking-wide">
                      {cardData.cardholderName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        cardData.status
                      )}`}
                    >
                      {cardData.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <a
                    href={`/cards/${cardData.id}/transactions`}
                    className="w-full block h-11 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl flex items-center justify-center transition-all"
                  >
                    View Transaction History
                  </a>
                  <button className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 hover:shadow-lg transition-all backdrop-blur">
                    Reissue Card
                  </button>
                  <button className="w-full h-11 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl transition-all">
                    Permanently Block
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
