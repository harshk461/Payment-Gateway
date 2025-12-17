"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

const OtpVerifyPage = () => {
  const router = useRouter();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const updatedOtp = [...otp];
    updatedOtp[idx] = value;
    setOtp(updatedOtp);

    // Auto-focus next input
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];
      updatedOtp[idx] = "";
      setOtp(updatedOtp);

      if (idx > 0) inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) return alert("Enter full OTP");

    try {
      setLoading(true);
      const mobile = localStorage.getItem("mobile");
      const res = await apiRequest.post("/users/verify-otp", {
        mobile,
        otp: otpCode,
      });

      // Save JWT
      localStorage.setItem("token", res.token);

      // Redirect user
      router.push("/");
    } catch (err) {
      alert(err);
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

        <h1 className="text-center text-xl font-semibold mb-1">
          Enter verification code
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          We’ve sent a 6-digit code to your phone.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="tel"
                maxLength={1}
                inputMode="numeric"
                value={otp[idx]}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-10 h-11 flex-1 text-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 outline-none
                           focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-100 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center h-11 rounded-full
                       bg-gradient-to-r from-[#4f46e5] to-[#6366f1]
                       text-sm font-medium text-white shadow-md shadow-indigo-200
                       hover:shadow-lg hover:shadow-indigo-300
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition"
          >
            {loading ? "Verifying..." : "Verify & continue"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-400">
          <button className="underline underline-offset-2 hover:text-slate-600">
            Resend code
          </button>
          <span className="mx-1">•</span>
          <button
            className="underline underline-offset-2 hover:text-slate-600"
            onClick={() => router.push("/login")}
          >
            Change phone number
          </button>
        </div>
      </div>
    </main>
  );
};

export default OtpVerifyPage;
