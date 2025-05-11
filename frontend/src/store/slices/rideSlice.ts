import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ride, RideStatus } from '@/types/ride';

interface RideState {
  activeRide: Ride | null;
  availableRides: Ride[];
  driverAvailableRides: Ride[];
  lastSearch: {
    pickup: string;
    dropoff: string;
  };
}

const initialState: RideState = {
  activeRide: null,
  availableRides: [],
  driverAvailableRides: [],
  lastSearch: {
    pickup: '',
    dropoff: '',
  }
};

// Load initial state from session storage
try {
  const activeRideJson = sessionStorage.getItem('activeRide');
  const availableRidesJson = sessionStorage.getItem('availableRides');
  
  if (activeRideJson) {
    initialState.activeRide = JSON.parse(activeRideJson);
  }
  
  if (availableRidesJson) {
    initialState.availableRides = JSON.parse(availableRidesJson);
  }
} catch (error) {
  console.error('Error loading ride state from session storage:', error);
}

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setLastSearch: (state, action: PayloadAction<{ pickup: string; dropoff: string }>) => {
      state.lastSearch = action.payload;
      // Store in session storage
      sessionStorage.setItem('lastSearch', JSON.stringify(action.payload));
    },
    
    clearLastSearch: (state) => {
      state.lastSearch = { pickup: '', dropoff: '' };
      sessionStorage.removeItem('lastSearch');
    },
    
    requestRide: (state, action: PayloadAction<Omit<Ride, 'id' | 'status'>>) => {
      const rideId = `ride-${Date.now()}`;
      const newRide: Ride = {
        id: rideId,
        status: 'requested',
        ...action.payload,
        requestTime: new Date().toISOString(),
      };
      
      // Add to available rides for drivers
      state.availableRides.push(newRide);
      
      // Set as active ride for customer
      state.activeRide = newRide;
      
      // Update session storage
      sessionStorage.setItem('activeRide', JSON.stringify(newRide));
      sessionStorage.setItem('availableRides', JSON.stringify(state.availableRides));
      
      return state;
    },
    
    updateRideStatus: (state, action: PayloadAction<{ rideId: string; newStatus: RideStatus }>) => {
      const { rideId, newStatus } = action.payload;
      
      // Update active ride if it matches
      if (state.activeRide && state.activeRide.id === rideId) {
        state.activeRide = { ...state.activeRide, status: newStatus };
        sessionStorage.setItem('activeRide', JSON.stringify(state.activeRide));
      }
      
      // Update in available rides
      state.availableRides = state.availableRides.map(ride => 
        ride.id === rideId ? { ...ride, status: newStatus } : ride
      );
      sessionStorage.setItem('availableRides', JSON.stringify(state.availableRides));
      
      return state;
    },
    
    acceptRideRequest: (state, action: PayloadAction<{ rideId: string; driverId: string }>) => {
      const { rideId, driverId } = action.payload;
      
      // Update ride status
      const updatedRides = state.availableRides.map(ride => 
        ride.id === rideId 
          ? { 
              ...ride, 
              status: 'accepted' as RideStatus, 
              driverId, 
              driverAcceptTime: new Date().toISOString() 
            } 
          : ride
      );
      
      state.availableRides = updatedRides;
      sessionStorage.setItem('availableRides', JSON.stringify(updatedRides));
      
      // Update active ride if it matches
      if (state.activeRide && state.activeRide.id === rideId) {
        state.activeRide = { 
          ...state.activeRide, 
          status: 'accepted', 
          driverId, 
          driverAcceptTime: new Date().toISOString() 
        };
        sessionStorage.setItem('activeRide', JSON.stringify(state.activeRide));
      }
      
      return state;
    },
    
    completeRide: (state, action: PayloadAction<string>) => {
      const rideId = action.payload;
      
      // Update ride status
      state.availableRides = state.availableRides.map(ride => 
        ride.id === rideId ? { ...ride, status: 'completed' as RideStatus } : ride
      );
      
      // Remove completed ride from available rides
      state.availableRides = state.availableRides.filter(ride => ride.id !== rideId);
      sessionStorage.setItem('availableRides', JSON.stringify(state.availableRides));
      
      // Clear active ride if it's the one that was completed
      if (state.activeRide && state.activeRide.id === rideId) {
        state.activeRide = null;
        sessionStorage.removeItem('activeRide');
      }
      
      return state;
    },
    
    cancelRide: (state, action: PayloadAction<string>) => {
      const rideId = action.payload;
      
      // Update ride status to cancelled
      state.availableRides = state.availableRides.map(ride => 
        ride.id === rideId ? { ...ride, status: 'cancelled' as RideStatus } : ride
      );
      
      // Remove cancelled ride from available rides
      state.availableRides = state.availableRides.filter(ride => ride.id !== rideId);
      sessionStorage.setItem('availableRides', JSON.stringify(state.availableRides));
      
      // Clear active ride if it's the one that was cancelled
      if (state.activeRide && state.activeRide.id === rideId) {
        state.activeRide = null;
        sessionStorage.removeItem('activeRide');
      }
      
      return state;
    },
    
    updateDriverAvailableRides: (state, action: PayloadAction<string | undefined>) => {
      const driverId = action.payload;
      
      if (!driverId) {
        state.driverAvailableRides = [];
        return state;
      }
      
      // Get rides that are:
      // 1. Requested (available for any driver)
      // 2. Accepted by this driver
      state.driverAvailableRides = state.availableRides.filter(ride => 
        ride.status === 'requested' || 
        (ride.status === 'accepted' && ride.driverId === driverId)
      );
      
      return state;
    },
    
    startRide: (state, action: PayloadAction<string>) => {
      const rideId = action.payload;
      
      // Update ride status
      state.availableRides = state.availableRides.map(ride => 
        ride.id === rideId 
          ? { 
              ...ride, 
              status: 'started' as RideStatus,
              rideStartTime: new Date().toISOString()
            } 
          : ride
      );
      
      sessionStorage.setItem('availableRides', JSON.stringify(state.availableRides));
      
      // Update active ride if it matches
      if (state.activeRide && state.activeRide.id === rideId) {
        state.activeRide = { 
          ...state.activeRide, 
          status: 'started',
          rideStartTime: new Date().toISOString()
        };
        sessionStorage.setItem('activeRide', JSON.stringify(state.activeRide));
      }
      
      return state;
    },
  },
});

export const { 
  setLastSearch,
  clearLastSearch,
  requestRide,
  updateRideStatus,
  acceptRideRequest,
  completeRide,
  cancelRide,
  updateDriverAvailableRides,
  startRide
} = rideSlice.actions;

export default rideSlice.reducer; 