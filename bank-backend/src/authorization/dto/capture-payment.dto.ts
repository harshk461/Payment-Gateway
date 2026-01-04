export class CapturePaymentDto {
  bankReferenceCode: string;
  amount?: number; // optional (for partial capture later)
}
