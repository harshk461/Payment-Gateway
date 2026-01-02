export async function tokenizeCard(baseUrl, cardDetails, key) {
  const res = await fetch(`${baseUrl}/tokenize/payment-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "test_key_123",
      Authorization: `Basic ${key}`,
    },
    body: JSON.stringify({
      type: "card",
      card: cardDetails.card,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Tokenization failed");

  return data.token;
}

export async function tokenizeUpi(baseUrl, upiId, key) {
  const res = await fetch(`${baseUrl}/tokenize/payment-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "test_key_123",
      Authorization: `Basic ${key}`,
    },
    body: JSON.stringify({
      type: "upi",
      upi: { id: upiId },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "UPI tokenization failed");

  return data.token;
}


export async function confirmPayment(baseUrl, intentId, payload, key) {
  const res = await fetch(
    `${baseUrl}/payment_intents/${intentId}/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "test_key_123",
        Authorization: `Basic ${key}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment failed");

  return data;
}
