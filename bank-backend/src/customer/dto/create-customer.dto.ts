export class CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  branchId: string; // Required
}

export class CreateCustomerWithAddressDto {
  customer: CreateCustomerDto;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    pinCode: string;
  };
}
