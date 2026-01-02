"use client";

import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCustomerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    kycStatus: "VERIFIED",
    accountType: "savings",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        accountType: formData.accountType,
        kycStatus: formData.kycStatus,
        branchId: 1,
      },
      address: {
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pincode,
      },
    };

    const response = await apiRequest.post("/customer/create", body);

    if (response) {
      router.replace("/customers");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          {/* Page header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/50 px-4 py-2 backdrop-blur-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">
                New customer onboarding
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Create New Customer
            </h1>
            <p className="text-xl text-gray-600">
              Add a new customer to your BlueTrust platform with complete KYC
              details.
            </p>
          </div>

          {/* Create form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-6 rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-sm font-semibold text-white">
                    1
                  </span>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="customer@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
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
                      <option value="premium">Premium Account</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6 rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-sm font-semibold text-white">
                    2
                  </span>
                  Address Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="House number, street name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    >
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full h-14 rounded-2xl border border-gray-200/50 bg-white/50 px-5 text-lg placeholder:text-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 lg:flex-none h-14 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-8 text-lg font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-200"
                >
                  Create Customer
                </button>
                <button
                  type="button"
                  className="flex-1 lg:flex-none h-14 rounded-3xl border border-gray-200/60 bg-white/60 px-8 text-lg font-semibold text-gray-900 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-gray-300/60 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Right: Preview card */}
            <div className="lg:block hidden">
              <div className="sticky top-24 rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Customer Preview
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary-light/5 border border-primary/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-light text-lg font-semibold text-white">
                      {formData.name
                        ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "AG"}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">
                        {formData.name || "Aman Gupta"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.email || "aman@bluetrust.com"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Phone</span>
                      <p className="font-semibold">
                        {formData.phone || "+91 98765 43210"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Account</span>
                      <p className="font-semibold capitalize">
                        {formData.accountType || "Savings"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">City</span>
                      <p className="font-semibold">
                        {formData.city || "Mumbai"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">PIN</span>
                      <p className="font-semibold">
                        {formData.pincode || "400001"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
