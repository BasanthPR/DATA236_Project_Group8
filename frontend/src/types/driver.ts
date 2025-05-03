
export interface DriverProfile {
  id: string; // SSN Format
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  carDetails: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  };
  rating: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    date: string;
    customerId: string;
  }[];
  mediaContent: {
    images: string[];
    video?: string;
  };
  ridesHistory: {
    id: string;
    date: string;
    pickupLocation: string;
    dropoffLocation: string;
    fare: number;
    customerId: string;
  }[];
}
