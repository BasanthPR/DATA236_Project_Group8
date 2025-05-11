import React, { createContext, useState, useEffect, useContext } from "react";
import { CustomerProfile } from "@/types/customer";
import { DriverProfile } from "@/types/driver";
import { Ride, RideStatus } from "@/types/ride";

interface UserContextType {
  customerProfile: CustomerProfile | null;
  driverProfile: DriverProfile | null;
  isCustomerLoggedIn: boolean;
  isDriverLoggedIn: boolean;
  updateCustomerProfile: (profile: CustomerProfile) => void;
  updateDriverProfile: (profile: DriverProfile) => void;
  loginCustomer: (profile: CustomerProfile) => void;
  loginDriver: (profile: DriverProfile) => void;
  logoutCustomer: () => void;
  logoutDriver: () => void;
  clearAllProfiles: () => void;
  isRideInProgress: boolean;
  setRideInProgress: (inProgress: boolean) => void;
  activeRide: Ride | null;
  requestRide: (rideDetails: Omit<Ride, 'id' | 'status'>) => string;
  updateRideStatus: (rideId: string, newStatus: RideStatus) => void;
  getDriverAvailableRides: () => Ride[];
  acceptRideRequest: (rideId: string, driverId: string) => void;
  completeRide: (rideId: string) => void;
  cancelRide: (rideId: string) => void;
}

const defaultCustomerProfile: CustomerProfile = {
  id: "123-45-6789",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  phoneNumber: "(555) 123-4567",
  email: "john.doe@example.com",
  rating: 4.74,
  cardDetails: {
    last4Digits: "4321",
    cardType: "Visa",
    expiryMonth: 12,
    expiryYear: 2025
  },
  ridesHistory: [],
  reviews: [],
  paymentMethods: [
    {
      id: "pm_1",
      type: "Visa",
      name: "Personal Card",
      isDefault: true,
      last4Digits: "4321"
    }
  ]
};

const UserContext = createContext<UserContextType>({
  customerProfile: null,
  driverProfile: null,
  isCustomerLoggedIn: false,
  isDriverLoggedIn: false,
  updateCustomerProfile: () => {},
  updateDriverProfile: () => {},
  loginCustomer: () => {},
  loginDriver: () => {},
  logoutCustomer: () => {},
  logoutDriver: () => {},
  clearAllProfiles: () => {},
  isRideInProgress: false,
  setRideInProgress: () => {},
  activeRide: null,
  requestRide: () => "",
  updateRideStatus: () => {},
  getDriverAvailableRides: () => [],
  acceptRideRequest: () => {},
  completeRide: () => {},
  cancelRide: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState<boolean>(false);
  const [isRideInProgress, setIsRideInProgress] = useState<boolean>(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);

  // Load profiles from localStorage on initial render
  useEffect(() => {
    const storedCustomerData = localStorage.getItem('customerData');
    const storedDriverData = localStorage.getItem('driverData');
    const customerLoggedIn = localStorage.getItem('customerLoggedIn') === 'true';
    const driverLoggedIn = localStorage.getItem('driverLoggedIn') === 'true';
    const rideInProgress = sessionStorage.getItem('activeRide') !== null;

    if (storedCustomerData) {
      try {
        const parsedCustomerData = JSON.parse(storedCustomerData);
        setCustomerProfile(parsedCustomerData);
        setIsCustomerLoggedIn(customerLoggedIn);
      } catch (error) {
        console.error("Error parsing customer data:", error);
      }
    }

    if (storedDriverData) {
      try {
        const parsedDriverData = JSON.parse(storedDriverData);
        setDriverProfile(parsedDriverData);
        setIsDriverLoggedIn(driverLoggedIn);
      } catch (error) {
        console.error("Error parsing driver data:", error);
      }
    }

    // Load active ride if exists
    const activeRideJson = sessionStorage.getItem('activeRide');
    if (activeRideJson) {
      try {
        const ride = JSON.parse(activeRideJson);
        setActiveRide(ride);
        setIsRideInProgress(true);
      } catch (error) {
        console.error("Error parsing active ride:", error);
      }
    }

    // Load available rides for drivers
    const availableRidesJson = sessionStorage.getItem('availableRides');
    if (availableRidesJson) {
      try {
        const rides = JSON.parse(availableRidesJson);
        setAvailableRides(rides);
      } catch (error) {
        console.error("Error parsing available rides:", error);
      }
    }
  }, []);

  // Ensure exclusive login - if a customer logs in, driver should be logged out and vice versa
  useEffect(() => {
    if (isCustomerLoggedIn && isDriverLoggedIn) {
      // If both are logged in, prioritize the most recent login
      const customerLoginTime = localStorage.getItem('customerLoginTime');
      const driverLoginTime = localStorage.getItem('driverLoginTime');
      
      if (customerLoginTime && driverLoginTime) {
        if (parseInt(customerLoginTime) > parseInt(driverLoginTime)) {
          // Customer login is more recent, log out driver
          logoutDriver();
        } else {
          // Driver login is more recent, log out customer
          logoutCustomer();
        }
      }
    }
  }, [isCustomerLoggedIn, isDriverLoggedIn]);

  // Save available rides to sessionStorage when they change
  useEffect(() => {
    if (availableRides.length > 0) {
      sessionStorage.setItem('availableRides', JSON.stringify(availableRides));
    } else {
      sessionStorage.removeItem('availableRides');
    }
  }, [availableRides]);

  // Save active ride to sessionStorage when it changes
  useEffect(() => {
    if (activeRide) {
      sessionStorage.setItem('activeRide', JSON.stringify(activeRide));
      setIsRideInProgress(true);
    } else {
      sessionStorage.removeItem('activeRide');
      setIsRideInProgress(false);
    }
  }, [activeRide]);

  const updateCustomerProfile = (profile: CustomerProfile) => {
    setCustomerProfile(profile);
    localStorage.setItem('customerData', JSON.stringify(profile));
  };

  const updateDriverProfile = (profile: DriverProfile) => {
    setDriverProfile(profile);
    localStorage.setItem('driverData', JSON.stringify(profile));
  };

  const loginCustomer = (profile: CustomerProfile) => {
    // If driver is logged in, log them out
    if (isDriverLoggedIn) {
      logoutDriver();
    }
    
    setCustomerProfile(profile);
    setIsCustomerLoggedIn(true);
    localStorage.setItem('customerData', JSON.stringify(profile));
    localStorage.setItem('customerLoggedIn', 'true');
    localStorage.setItem('customerLoginTime', Date.now().toString());
  };

  const loginDriver = (profile: DriverProfile) => {
    // If customer is logged in, log them out
    if (isCustomerLoggedIn) {
      logoutCustomer();
    }
    
    setDriverProfile(profile);
    setIsDriverLoggedIn(true);
    localStorage.setItem('driverData', JSON.stringify(profile));
    localStorage.setItem('driverLoggedIn', 'true');
    localStorage.setItem('driverLoginTime', Date.now().toString());
  };

  const logoutCustomer = () => {
    setIsCustomerLoggedIn(false);
    localStorage.removeItem('customerLoggedIn');
    localStorage.removeItem('customerLoginTime');
  };

  const logoutDriver = () => {
    setIsDriverLoggedIn(false);
    localStorage.removeItem('driverLoggedIn');
    localStorage.removeItem('driverLoginTime');
  };

  const clearAllProfiles = () => {
    setCustomerProfile(null);
    setDriverProfile(null);
    setIsCustomerLoggedIn(false);
    setIsDriverLoggedIn(false);
    localStorage.removeItem('customerData');
    localStorage.removeItem('driverData');
    localStorage.removeItem('customerLoggedIn');
    localStorage.removeItem('driverLoggedIn');
    localStorage.removeItem('customerLoginTime');
    localStorage.removeItem('driverLoginTime');
  };

  const setRideInProgress = (inProgress: boolean) => {
    setIsRideInProgress(inProgress);
    if (!inProgress) {
      sessionStorage.removeItem('activeRide');
      setActiveRide(null);
    }
  };

  const requestRide = (rideDetails: Omit<Ride, 'id' | 'status'>) => {
    const rideId = `ride-${Date.now()}`;
    const newRide: Ride = {
      id: rideId,
      status: 'requested',
      ...rideDetails,
      requestTime: new Date().toISOString(),
    };
    
    // Add to available rides for drivers
    setAvailableRides(prev => [...prev, newRide]);
    
    // Set as active ride for customer
    setActiveRide(newRide);
    
    return rideId;
  };

  const updateRideStatus = (rideId: string, newStatus: RideStatus) => {
    // Update active ride if it matches
    if (activeRide && activeRide.id === rideId) {
      const updatedRide = { ...activeRide, status: newStatus };
      setActiveRide(updatedRide);
    }
    
    // Update in available rides
    setAvailableRides(prev => 
      prev.map(ride => 
        ride.id === rideId ? { ...ride, status: newStatus } : ride
      )
    );
  };

  const getDriverAvailableRides = () => {
    return availableRides.filter(ride => 
      ride.status === 'requested' || 
      (ride.status === 'accepted' && ride.driverId === driverProfile?.id)
    );
  };

  const acceptRideRequest = (rideId: string, driverId: string) => {
    // Update ride status
    updateRideStatus(rideId, 'accepted');
    
    // Update driver ID
    setAvailableRides(prev => 
      prev.map(ride => 
        ride.id === rideId ? { ...ride, driverId, driverAcceptTime: new Date().toISOString() } : ride
      )
    );
    
    // Update active ride if it matches
    if (activeRide && activeRide.id === rideId) {
      setActiveRide(prev => 
        prev ? { ...prev, status: 'accepted', driverId, driverAcceptTime: new Date().toISOString() } : null
      );
    }
  };

  const completeRide = (rideId: string) => {
    // Update ride status
    updateRideStatus(rideId, 'completed');
    
    // Get the ride
    const ride = availableRides.find(r => r.id === rideId);
    
    if (ride) {
      // Add to customer ride history
      if (customerProfile && ride.customerId === customerProfile.id) {
        const updatedProfile = {
          ...customerProfile,
          ridesHistory: [
            ...customerProfile.ridesHistory,
            {
              id: ride.id,
              date: new Date().toISOString(),
              pickupLocation: ride.pickupLocation,
              destination: ride.dropoffLocation,
              distance: ride.distance || 0,
              price: ride.price,
              driverId: ride.driverId || ""
            }
          ]
        };
        updateCustomerProfile(updatedProfile);
      }
      
      // Add to driver ride history
      if (driverProfile && ride.driverId === driverProfile.id) {
        const updatedProfile = {
          ...driverProfile,
          ridesHistory: [
            ...driverProfile.ridesHistory,
            {
              id: ride.id,
              date: new Date().toISOString(),
              pickupLocation: ride.pickupLocation,
              dropoffLocation: ride.dropoffLocation,
              fare: ride.price || 0,
              customerId: ride.customerId || ""
            }
          ]
        };
        updateDriverProfile(updatedProfile);
      }
      
      // Remove from available rides
      setAvailableRides(prev => prev.filter(r => r.id !== rideId));
      
      // Clear active ride if it's the one that was completed
      if (activeRide && activeRide.id === rideId) {
        setActiveRide(null);
      }
    }
  };

  const cancelRide = (rideId: string) => {
    // Update ride status
    updateRideStatus(rideId, 'cancelled');
    
    // Remove from available rides
    setAvailableRides(prev => prev.filter(r => r.id !== rideId));
    
    // Clear active ride if it's the one that was cancelled
    if (activeRide && activeRide.id === rideId) {
      setActiveRide(null);
    }
  };

  return (
    <UserContext.Provider value={{
      customerProfile,
      driverProfile,
      isCustomerLoggedIn,
      isDriverLoggedIn,
      updateCustomerProfile,
      updateDriverProfile,
      loginCustomer,
      loginDriver,
      logoutCustomer,
      logoutDriver,
      clearAllProfiles,
      isRideInProgress,
      setRideInProgress,
      activeRide,
      requestRide,
      updateRideStatus,
      getDriverAvailableRides,
      acceptRideRequest,
      completeRide,
      cancelRide
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
