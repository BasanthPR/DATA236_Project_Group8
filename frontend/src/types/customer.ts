
export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  rating: number;
  cardDetails: {
    last4Digits: string;
    cardType: string;
    expiryMonth: number;
    expiryYear: number;
  };
  ridesHistory: {
    id: string;
    date: string;
    destination: string;
    price: number;
    driverId?: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    date: string;
    driverId?: string;
  }[];
  paymentMethods?: {
    id: string;
    type: string;
    name: string;
    isDefault: boolean;
    last4Digits?: string;
  }[];
}
