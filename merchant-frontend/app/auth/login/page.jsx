"use client";

import { apiRequest } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PhoneLoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    if (mobile.trim().length < 10) {
      alert("Enter valid mobile number");
      return;
    }

    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiRequest.post("/users/send-otp", { mobile });

      if (response?.success) {
        localStorage.setItem("mobile", mobile);
        router.push("/auth/otp-verify");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-[Inter,_system-ui,_sans-serif] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-7 shadow-[0_24px_70px_rgba(15,23,42,0.20)] border border-slate-100">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] flex items-center justify-center text-white text-xs font-semibold">
            S
          </div>
        </div>

        <h1 className="text-center text-xl font-semibold text-slate-900 mb-1">
          Sign in with phone
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Enter your phone number to receive a one-time code.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Phone number
            </label>
            <div className="flex items-center gap-2">
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-100 transition"
                defaultValue="+91"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                id="phone"
                type="tel"
                required
                placeholder="98765 43210"
                className="block w-full h-11 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none
                           placeholder:text-slate-400
                           focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-100 transition"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Standard SMS rates may apply. We’ll never share your number.
            </p>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center h-11 rounded-full
                       bg-gradient-to-r from-[#4f46e5] to-[#6366f1]
                       text-sm font-medium text-white shadow-md shadow-indigo-200
                       hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-4 focus:ring-indigo-100
                       active:translate-y-0 active:shadow-sm transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          By continuing, you agree to our{" "}
          <button className="underline underline-offset-2 hover:text-slate-600">
            Terms
          </button>{" "}
          and{" "}
          <button className="underline underline-offset-2 hover:text-slate-600">
            Privacy Policy
          </button>
          .
        </p>
      </div>
    </main>
  );
};

export default PhoneLoginPage;
