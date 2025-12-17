// app/dashboard/docs/page.tsx
"use client";

const BASE_URL = "https://api.yourpayments.com/api/v1";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">
            API Documentation
          </p>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Payments API
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            REST API to create merchants, payment intents, refunds and handle
            webhooks.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Base URL */}
        <section className="rounded-2xl border border-sky-500/60 bg-sky-500/10 p-4">
          <h2 className="text-sm font-semibold text-sky-100 mb-2">Base URL</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
              {BASE_URL}
            </span>
            <span className="text-[11px] text-slate-200">
              All endpoints are relative to this base.
            </span>
          </div>
        </section>

        {/* 1. Merchant APIs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            1. Merchant APIs
          </h2>

          {/* 1.1 Register Merchant */}
          <EndpointBlock
            method="POST"
            path="/merchants/register"
            title="1.1 Register Merchant"
            description="Register a new merchant and generate API keys."
            headers={{
              "Content-Type": "application/json",
            }}
            requestBody={{
              name: "Harsh",
              businessName: "Harsh Store",
              email: "harsh@example.com",
              webhookUrl: "https://harshstore.com/webhook/payment",
            }}
            responseBody={{
              merchantId: 12,
              publicKey: "pk_test_123456abcd",
              secretKey: "sk_test_9876abcd321",
            }}
          />

          {/* 1.2 Get Merchant Profile */}
          <EndpointBlock
            method="GET"
            path="/merchants/me"
            title="1.2 Get Merchant Profile"
            description="Get the authenticated merchant profile using the secret key."
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              merchantId: 12,
              name: "Harsh",
              businessName: "Harsh Store",
              email: "harsh@example.com",
              webhookUrl: "https://harshstore.com/webhook/payment",
              publicKey: "pk_test_123456abcd",
              status: "ACTIVE",
            }}
          />

          {/* 1.3 Update Webhook URL */}
          <EndpointBlock
            method="PUT"
            path="/merchants/webhook"
            title="1.3 Update Webhook URL"
            headers={{
              Authorization: "Bearer <secretKey>",
              "Content-Type": "application/json",
            }}
            requestBody={{
              webhookUrl: "https://harshstore.com/new/webhook",
            }}
            responseBody={{
              merchantId: 12,
              webhookUrl: "https://harshstore.com/new/webhook",
              message: "Webhook updated successfully",
            }}
          />

          {/* 1.4 Regenerate API Keys */}
          <EndpointBlock
            method="POST"
            path="/merchants/regenerate"
            title="1.4 Regenerate API Keys"
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              merchantId: 12,
              publicKey: "pk_test_new123",
              secretKey: "sk_test_new123",
            }}
          />

          {/* 1.5 Disable / 1.6 Enable */}
          <EndpointBlock
            method="PUT"
            path="/merchants/disable"
            title="1.5 Disable Merchant"
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              merchantId: 12,
              status: "DISABLED",
            }}
          />
          <EndpointBlock
            method="PUT"
            path="/merchants/enable"
            title="1.6 Enable Merchant"
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              merchantId: 12,
              status: "ACTIVE",
            }}
          />
        </section>

        {/* 2. Payment Intent APIs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            2. Payment Intent APIs
          </h2>

          {/* 2.1 Create Payment Intent */}
          <EndpointBlock
            method="POST"
            path="/payment/create"
            title="2.1 Create Payment Intent"
            headers={{
              Authorization: "Bearer <secretKey>",
              "Content-Type": "application/json",
              "Idempotency-Key": "<unique-id> (optional)",
            }}
            requestBody={{
              amount: 50000,
              currency: "INR",
              description: "Order #123",
              metadata: { orderId: "789" },
            }}
            responseBody={{
              intentId: 94,
              amount: 50000,
              currency: "INR",
              clientSecret: "pi_123_secret_abc",
              status: "CREATED",
            }}
          />

          {/* 2.2 Get Payment Intent */}
          <EndpointBlock
            method="GET"
            path="/payment/{intentId}"
            title="2.2 Get Payment Intent"
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              intentId: 94,
              amount: 50000,
              currency: "INR",
              status: "SUCCEEDED",
              providerReference: "txn_abc123",
              paymentMethod: "CARD",
            }}
          />
        </section>

        {/* 3. Payment Confirmation */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            3. Payment Confirmation API
          </h2>

          <EndpointBlock
            method="POST"
            path="/payment/{intentId}/confirm"
            title="3.1 Confirm Payment"
            headers={{
              Authorization: "Bearer <secretKey>",
              "Content-Type": "application/json",
            }}
            requestBody={{
              paymentMethodToken: "pm_tok_1234abcd",
            }}
            responseBody={{
              intentId: 94,
              status: "SUCCEEDED",
              amount: 50000,
              currency: "INR",
              providerReference: "dummy_txn_9834abc",
            }}
            extraNote="On failure, the response returns { intentId, status: 'FAILED' }."
          />
        </section>

        {/* 4. Tokenization */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            4. Tokenization APIs
          </h2>

          <EndpointBlock
            method="POST"
            path="/payment_methods/tokenize"
            title="4.1 Tokenize Payment Method"
            headers={{
              Authorization: "Bearer <secretKey>",
              "Content-Type": "application/json",
            }}
            requestBody={{
              type: "card",
              card: {
                number: "4111111111111111",
                expMonth: 12,
                expYear: 2030,
                cvv: "123",
              },
            }}
            responseBody={{
              token: "pm_tok_123xyz",
              methodType: "CARD",
              brand: "VISA",
              last4: "1111",
            }}
          />
        </section>

        {/* 5. Refund APIs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            5. Refund APIs
          </h2>

          <EndpointBlock
            method="POST"
            path="/refunds/create"
            title="5.1 Create Refund"
            headers={{
              Authorization: "Bearer <secretKey>",
              "Content-Type": "application/json",
            }}
            requestBody={{
              transactionId: 552,
              amount: 20000,
            }}
            responseBody={{
              refundId: 33,
              status: "PENDING",
              amount: 20000,
            }}
          />

          <EndpointBlock
            method="GET"
            path="/refunds/{id}"
            title="5.2 Get Refund Details"
            headers={{
              Authorization: "Bearer <secretKey>",
            }}
            requestBody={null}
            responseBody={{
              refundId: 33,
              transactionId: 552,
              amount: 20000,
              status: "SUCCESS",
            }}
          />
        </section>

        {/* 6. Webhooks */}
        <section className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-slate-200">6. Webhooks</h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3 text-xs">
            <h3 className="text-sm font-medium text-slate-200 mb-1">
              6.1 Receive Merchant Webhook Events
            </h3>
            <p className="text-slate-400">
              Your payment gateway sends POST requests to the merchant&apos;s
              webhook URL.
            </p>
            <p className="text-[11px] text-slate-500">
              Method: <span className="font-mono">POST</span> to your configured{" "}
              <span className="font-mono">webhookUrl</span>.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <CodeBlock
                label="Example payload (success)"
                json={{
                  event: "payment.succeeded",
                  intentId: 94,
                  amount: 50000,
                  currency: "INR",
                }}
              />
              <CodeBlock
                label="Example payload (failed)"
                json={{
                  event: "payment.failed",
                  intentId: 94,
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Small components */

function EndpointBlock({
  method,
  path,
  title,
  description,
  headers,
  requestBody,
  responseBody,
  extraNote,
}) {
  const methodColor =
    method === "GET"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
      : method === "POST"
      ? "bg-sky-500/10 text-sky-300 border-sky-500/40"
      : "bg-amber-500/10 text-amber-200 border-amber-500/40";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 text-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          {description && (
            <p className="mt-1 text-[11px] text-slate-500">{description}</p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${methodColor}`}
        >
          {method} <span className="mx-1 text-slate-500">·</span>
          {path}
        </span>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-[11px] text-slate-300">Headers</p>
        <CodeBlock json={headers} compact />
      </div>

      {requestBody !== null && (
        <div className="space-y-2">
          <p className="font-medium text-[11px] text-slate-300">Request body</p>
          <CodeBlock json={requestBody} />
        </div>
      )}

      <div className="space-y-2">
        <p className="font-medium text-[11px] text-slate-300">Response body</p>
        <CodeBlock json={responseBody} />
      </div>

      {extraNote && <p className="text-[11px] text-slate-500">{extraNote}</p>}
    </div>
  );
}

function CodeBlock({ json, label, compact }) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
      )}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto">
        <pre className={compact ? "whitespace-pre" : "whitespace-pre-wrap"}>
          {JSON.stringify(json, null, 2)}
        </pre>
      </div>
    </div>
  );
}
