export type RideStatus = 
  | 'requested'  // Customer requested, waiting for driver
  | 'accepted'   // Driver accepted the ride
  | 'started'    // Driver has started the ride
  | 'completed'  // Ride is complete
  | 'cancelled'; // Ride was cancelled

export type RideType = 
  | 'UberX'
  | 'Comfort'
  | 'UberXL'
  | 'Black'
  | 'Black SUV';

export interface Ride {
  id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates?: [number, number];
  dropoffCoordinates?: [number, number];
  distance?: number;
  duration?: number;
  price: number;
  currency?: string;
  status: RideStatus;
  rideType?: RideType;
  requestTime: string; // ISO timestamp
  driverAcceptTime?: string; // ISO timestamp
  rideStartTime?: string; // ISO timestamp
  rideEndTime?: string; // ISO timestamp
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  customerRating?: number;
  driverRating?: number;
  customerName?: string;
  driverName?: string;
} 