
export interface BillingInfo {
  id: string; // SSN Format
  date: string;
  pickupTime: string;
  dropoffTime: string;
  distanceCovered: number; // in miles
  totalAmount: number;
  sourceLocation: string;
  destinationLocation: string;
  driverId: string;
  customerId: string;
  predictedPrice?: number;
  actualPrice?: number;
}
