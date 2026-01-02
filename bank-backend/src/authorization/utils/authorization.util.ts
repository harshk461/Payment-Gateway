export function validateCvv(cvv: string, cardNumber: string): boolean {
  if (!/^\d+$/.test(cvv)) {
    return false;
  }

  // AMEX starts with 34 or 37
  const isAmex = /^3[47]/.test(cardNumber);

  if (isAmex) {
    return cvv.length === 4;
  }

  return cvv.length === 3;
}

export function validateExpiry(
  expiryMonth: string,
  expiryYear: string,
): boolean {
  const month = Number(expiryMonth);
  const year = Number(expiryYear);

  if (isNaN(month) || isNaN(year)) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  // Convert YY → YYYY (assume 20xx)
  const fullYear = year < 100 ? 2000 + year : year;

  // Expiry at end of month
  const expiryDate = new Date(fullYear, month, 0, 23, 59, 59);
  const now = new Date();

  return expiryDate >= now;
}
