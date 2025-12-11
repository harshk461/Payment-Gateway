export async function tokenizeCard(baseUrl, cardDetails) {
  const res = await fetch(`${baseUrl}/tokenize/payment-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
        "X-API-KEY":"test_key_123"
     },
    body: JSON.stringify({
      type: "card",
      card: cardDetails
    }),
  });

  const data = await res.json();
  return data.token;
}

export async function confirmPayment(baseUrl, intentId, token) {
  const res = await fetch(`${baseUrl}/payment_intents/${intentId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json","X-API-KEY":"test_key_123" },
    body: JSON.stringify({ paymentMethodToken: token }),
  });

  return await res.json();
}
