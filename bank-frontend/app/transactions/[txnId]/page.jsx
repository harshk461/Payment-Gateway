const transactionData = {
  id: "TXN001",
  date: "2025-12-21 15:42:30 IST",
  type: "credit",
  amount: 25000,
  fees: 0,
  customer: {
    name: "Priya Sharma",
    id: "CUST001",
    phone: "+91 98765 43210",
    email: "priya.sharma@email.com",
  },
  account: {
    id: "ACC001",
    type: "Premium Savings",
    balanceBefore: 817150,
    balanceAfter: 842150,
  },
  source: {
    type: "NEFT/RTGS",
    reference: "N123456789",
    bank: "HDFC Bank",
    ifsc: "HDFC0000123",
  },
  description: "Salary Credit - ABC Corporation",
  status: "completed",
  notes: "Monthly salary for December 2025",
};

export default function TransactionDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans text-gray-900">
      <div className="pt-6 lg:pt-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${
                  transactionData.type === "credit"
                    ? "bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/25"
                    : "bg-red-100 text-red-600 shadow-lg shadow-red-500/25"
                }`}
              >
                {transactionData.type === "credit" ? "↑" : "↓"}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {transactionData.id}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    {transactionData.status}
                  </span>
                  <span>{transactionData.date}</span>
                  <span className="capitalize">{transactionData.type}</span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {transactionData.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 self-end">
              <button className="h-12 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl">
                Reverse transaction
              </button>
              <button className="h-12 px-6 rounded-3xl border border-gray-200 bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl">
                Download receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: amounts & balances */}
            <div className="space-y-6">
              {/* Amount breakdown */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Amount breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Principal</span>
                    <span
                      className={`font-mono font-bold text-xl ${
                        transactionData.type === "credit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transactionData.type === "credit" ? "+" : "-"}₹
                      {transactionData.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Fees</span>
                    <span className="font-mono font-bold text-xl text-gray-500">
                      ₹0
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-lg font-semibold text-gray-900">
                      Net amount
                    </span>
                    <span
                      className={`font-mono font-bold text-2xl ${
                        transactionData.type === "credit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transactionData.type === "credit" ? "+" : "-"}₹
                      {transactionData.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account balance change */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Account balance
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Before</span>
                    <span className="font-mono text-lg font-semibold text-gray-900">
                      ₹{transactionData.account.balanceBefore.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">After</span>
                    <span className="font-mono text-lg font-semibold text-gray-900">
                      ₹{transactionData.account.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div
                      className={`h-full rounded-full ${
                        transactionData.type === "credit"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : "bg-gradient-to-r from-red-500 to-red-400"
                      }`}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: details & metadata */}
            <div className="space-y-6">
              {/* Customer info */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Customer details
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-sm font-semibold text-white">
                      PS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transactionData.customer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transactionData.customer.id}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold">
                      {transactionData.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">
                      {transactionData.customer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source info */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-8 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Payment source
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Method</p>
                    <p className="font-semibold capitalize">
                      {transactionData.source.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reference</p>
                    <p className="font-mono font-semibold">
                      {transactionData.source.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bank</p>
                    <p className="font-semibold">
                      {transactionData.source.bank}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">IFSC</p>
                    <p className="font-mono font-semibold">
                      {transactionData.source.ifsc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-2xl shadow-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Actions
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <a
                    href={`/customers/${transactionData.customer.id}`}
                    className="h-12 rounded-2xl bg-primary-soft px-4 text-primary font-semibold flex items-center justify-center hover:bg-primary-soft/80 shadow-sm hover:shadow-md transition-all"
                  >
                    View customer
                  </a>
                  <a
                    href={`/accounts/${transactionData.account.id}`}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-gray-900 font-semibold flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    View account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
