// src/types/customer.ts

export interface RideHistory {
  id: string;
  date: string;
  destination: string;
  price: number;
  driverId?: string;
  // Add compatibility fields for different backend structures
  to?: string;
  fare?: number;
}

export interface CustomerReview {
  id: string;
  rating: number;
  comment: string;
  date: string;
  driverId?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  isDefault: boolean;
  last4Digits?: string;
}

export interface CardDetails {
  last4Digits: string;
  cardType: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CustomerProfile {
  id?: string;
  customerId?: string; // SSN format
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email: string;
  rating?: number;
  cardDetails?: CardDetails;
  ridesHistory?: RideHistory[];
  reviews?: CustomerReview[];
  paymentMethods?: PaymentMethod[];
  // Add this flag to indicate if this is a new profile
  isNewProfile?: boolean;
}

// For form operations, a partial version is useful
export type CustomerProfileFormData = Partial<CustomerProfile>;