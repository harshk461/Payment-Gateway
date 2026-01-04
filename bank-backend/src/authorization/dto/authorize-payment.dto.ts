export class AuthorizePaymentDto {
  paymentMethodToken: string;
  amount: number;
  currency: string;

  orderId: string;
  merchantId: string; // ideally from auth context, not body
}
