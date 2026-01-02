// utils/card.utils.ts
export function luhnCheckDigit(body: string): number {
  let sum = 0;
  let alternate = true;
  for (let i = body.length - 1; i >= 0; i--) {
    let n = parseInt(body[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return (10 - (sum % 10)) % 10;
}

export function generateCardNumber(network: string = 'VISA'): string {
  // BINs: VISA(4xxx), MC(5xxx), RUPAY(5xxx), AMEX(3xxx)
  const bins = {
    VISA: '411111',
    MASTERCARD: '555555',
    RUPAY: '508117',
    AMEX: '378282',
  };

  const bin = bins[network] || '411111';
  const randomLength = 15 - bin.length;
  let body = bin;

  for (let i = 0; i < randomLength; i++) {
    body += Math.floor(Math.random() * 10).toString();
  }

  const checkDigit = luhnCheckDigit(body);
  return body + checkDigit.toString();
}

export function generateCardId(): string {
  return `CARD${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, '0')}`;
}
