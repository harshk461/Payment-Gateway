// PayNowModal.jsx
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PayNowModal = ({ order, onClose }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://localhost:3001/checkout.js";
    script.onload = () => setSdkLoaded(true);
    document.body.appendChild(script);
  }, []);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (order) {
      setAmount(order.total.toString());
    }
  }, [order]);

  if (!order) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!sdkLoaded) {
        alert("Payment SDK not loaded yet");
        return;
      }

      const orderPaymentBody = {
        amount,
        currency: "INR",
        idempotencyKey: "test_" + Date.now(),
        orderId: order.orderId,
      };
      const intent = await apiRequest.post(
        "/payments/create-order",
        orderPaymentBody
      );

      if (intent) {
        const pg = new window.PaymentGateway({
          key: "sk_live_3fd774809659ffa6",
          baseUrl: "http://localhost:8080/api/v1",
        });
        pg.open({
          intentId: intent.intentId,
          amount: intent.amount,
          currency: intent.currency,
        });
      }
    } catch (err) {
      // toast.error(err);
      console.log(err);
    }
    // onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm hover:bg-slate-200"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Pay for order
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          Order ID: <span className="font-mono">{order.orderId}</span>
        </p>

        {/* Product list inside modal */}
        <div className="mb-4 max-h-44 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
          {order.products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0 border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
                <div>
                  <p className="font-medium text-slate-900 line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-slate-500">Qty {p.qty}</p>
                </div>
              </div>
              <p className="font-semibold text-slate-900">
                ₹{(p.perPrice * p.qty).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* Amount input + Pay now */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pay-amount"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Amount to pay (₹)
            </label>
            <input
              id="pay-amount"
              type="number"
              min={1}
              max={order.total}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none
                         focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-100 transition"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Order total is{" "}
              <span className="font-semibold text-slate-700">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
              . You can pay full or a partial amount now.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center h-11 rounded-full
                       bg-gradient-to-r from-[#4f46e5] to-[#6366f1]
                       text-sm font-medium text-white shadow-md shadow-indigo-200
                       hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-4 focus:ring-indigo-100
                       active:translate-y-0 active:shadow-sm transition"
          >
            Pay ₹{Number(amount || 0).toLocaleString("en-IN")}
          </button>
        </form>

        <p className="mt-3 text-[11px] text-slate-400">
          Payments are processed securely. You’ll see a detailed receipt after
          successful payment.
        </p>
      </div>
    </div>
  );
};

export default PayNowModal;
