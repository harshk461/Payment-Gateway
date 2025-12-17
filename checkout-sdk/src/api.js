export async function tokenizeCard(baseUrl, cardDetails,key) {
  const res = await fetch(`${baseUrl}/tokenize/payment-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
        "X-API-KEY":"test_key_123",
        'Authorization':`Basic ${key}`
     },
    body: JSON.stringify({
      type: "card",
      card: {...cardDetails?.card}
    }),
  });

  const data = await res.json();
  return data.token;
}

export async function confirmPayment(baseUrl, intentId, token,key) {
  const res = await fetch(`${baseUrl}/payment_intents/${intentId}/confirm`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-API-KEY":"test_key_123",
      'Authorization':`Basic ${key}`
     },
    body: JSON.stringify({ paymentMethodToken: token }),
  });

  return await res.json();
}
