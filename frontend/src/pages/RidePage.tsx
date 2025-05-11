import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Map from "@/components/Map";
import RideNavbar from "@/components/RideNavbar";
import PickupTimeModal from "@/components/PickupTimeModal";
import RideSelectionScreen from "@/components/RideSelectionScreen";
import RiderSelectionModal from "@/components/RiderSelectionModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { requestRide, cancelRide } from "@/store/slices/rideSlice";
import { RideType } from "@/types/ride";

const RidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLocation, setPickupLocation] = useState<[number, number] | undefined>(undefined);
  const [dropoffLocation, setDropoffLocation] = useState<[number, number] | undefined>(undefined);
  const [pickupTimeModalOpen, setPickupTimeModalOpen] = useState(false);
  const [showRideSelection, setShowRideSelection] = useState(false);
  const [riderModalOpen, setRiderModalOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState("Pickup now");
  const [selectedRider, setSelectedRider] = useState("For me");
  
  const { isCustomerLoggedIn, customerProfile } = useUser();
  const { activeRide, lastSearch } = useAppSelector(state => state.ride);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const rideType = queryParams.get('type');
  const shouldShowSelection = queryParams.get('selection') === 'true';

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to book a ride",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isCustomerLoggedIn, navigate]);

  // Load pickup and dropoff from either session storage or Redux state
  useEffect(() => {
    if (lastSearch.pickup && lastSearch.dropoff) {
      setPickup(lastSearch.pickup);
      setDropoff(lastSearch.dropoff);
      
      // For demo purposes, using fixed coordinates
      setPickupLocation([-122.1430, 37.4419]); // Palo Alto
      setDropoffLocation([-122.0841, 37.3893]); // Mountain View
      
      // If we have location data and should show selection screen
      if (shouldShowSelection) {
        setShowRideSelection(true);
      }
    } else {
    const storedPickup = sessionStorage.getItem('pickup');
    const storedDropoff = sessionStorage.getItem('dropoff');
    
    if (storedPickup) setPickup(storedPickup);
    if (storedDropoff) setDropoff(storedDropoff);
    }
    
    // If ride type is specified, open ride selection screen
    if (rideType) {
      setShowRideSelection(true);
    }
  }, [lastSearch, shouldShowSelection, rideType]);

  // Monitor active ride status and redirect if needed
  useEffect(() => {
    if (activeRide) {
      switch (activeRide.status) {
        case 'accepted':
          // Driver accepted the ride, redirect to payment page
          toast({
            title: "Driver Found!",
            description: "Your ride has been accepted by a driver",
          });
          navigate('/payment');
          break;
        case 'started':
          // Ride is in progress, redirect to payment page
          navigate('/payment');
          break;
        case 'completed':
          // Ride completed, redirect to activity page
          toast({
            title: "Ride Completed",
            description: "Your ride has been completed",
          });
          navigate('/activity');
          break;
        case 'cancelled':
          // Ride was cancelled, reset state
          toast({
            title: "Ride Cancelled",
            description: "Your ride request was cancelled",
            variant: "destructive"
          });
          setShowRideSelection(false);
          break;
        default:
          break;
      }
    }
  }, [activeRide, navigate]);

  const handleAddressSearch = () => {
    if (!pickup || !dropoff) {
      toast({
        title: "Missing information",
        description: "Please enter both pickup and dropoff locations",
        variant: "destructive"
      });
      return;
    }
    
    // Store the locations in session storage
    sessionStorage.setItem('pickup', pickup);
    sessionStorage.setItem('dropoff', dropoff);
    
    // For demo purposes, using fixed coordinates
    setPickupLocation([-122.1430, 37.4419]); // Palo Alto
    setDropoffLocation([-122.0841, 37.3893]); // Mountain View
    
    setShowRideSelection(true);
  };

  const handlePickupTimeSelect = (time: string, date: string) => {
    setPickupTime(`${date} ${time}`);
    setPickupTimeModalOpen(false);
  };

  const handleRiderSelect = (rider: string) => {
    setSelectedRider(rider);
    setRiderModalOpen(false);
  };

  const handleBackFromRideSelection = () => {
    setShowRideSelection(false);
    navigate('/ride', { replace: true });
  };

  const handleRideSelected = (rideType: string, price: number) => {
    if (!customerProfile) {
      toast({
        title: "Login Required",
        description: "Please login to book a ride",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Calculate distance (mock for demo)
    const distance = 5.2; // miles
    const duration = 15; // minutes
    
    // Request the ride through Redux
    dispatch(requestRide({
      customerId: customerProfile.id,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      pickupCoordinates: pickupLocation,
      dropoffCoordinates: dropoffLocation,
      price: price,
      currency: "USD",
      distance: distance,
      duration: duration,
      rideType: rideType as RideType,
      customerName: `${customerProfile.firstName} ${customerProfile.lastName}`,
      customerRating: customerProfile.rating,
      paymentMethod: customerProfile.paymentMethods.find(pm => pm.isDefault)?.id || undefined,
      paymentStatus: "pending"
    }));
    
    // Show a finding driver message
    toast({
      title: "Finding a driver",
      description: "Please wait while we connect you with a driver",
    });
  };

  const handleCancelRideRequest = () => {
    if (activeRide) {
      dispatch(cancelRide(activeRide.id));
      setShowRideSelection(false);
    }
  };

  if (activeRide && activeRide.status === 'requested') {
    return (
      <div className="h-screen w-full flex flex-col">
        <RideNavbar />
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-t-black border-gray-200 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Finding your driver</h2>
            <p className="text-gray-600 mb-4">Please wait while we connect you with a nearby driver</p>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">From:</span>
                <span>{activeRide.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">To:</span>
                <span>{activeRide.dropoffLocation}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Price:</span>
                <span>${activeRide.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Ride type:</span>
                <span>{activeRide.rideType || "UberX"}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCancelRideRequest}
            >
              Cancel Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showRideSelection) {
    return (
      <RideSelectionScreen
        pickupLocation={pickup}
        dropoffLocation={dropoff}
        onBack={handleBackFromRideSelection}
        onRideSelected={handleRideSelected}
        initialRideType={rideType || undefined}
      />
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <RideNavbar />
      
      <div className="flex-1 relative pt-20">
        {/* Map takes the full screen */}
        <Map 
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          className="h-full w-full absolute inset-0"
        />
        
        {/* Ride request form overlay - Sticky at the top with increased z-index */}
        <div className="absolute inset-0 z-30 flex justify-center items-start pt-16">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4">Get a ride</h2>
            
            <div className="space-y-3 mb-4">
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <input
                  type="text"
                  placeholder="Pickup location"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <input
                  type="text"
                  placeholder="Dropoff location"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4 flex gap-4">
              {/* Pickup time dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-1/2 flex items-center justify-between border border-gray-300 p-3 h-12"
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{pickupTime}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white">
                  <DropdownMenuItem onSelect={() => setPickupTime("Pickup now")}>
                    Pickup now
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setPickupTimeModalOpen(true)}>
                    Schedule for later
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Rider selection dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-1/2 flex items-center justify-between border border-gray-300 p-3 h-12"
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      <span>{selectedRider}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem onSelect={() => setSelectedRider("For me")}>
                    For me
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRiderModalOpen(true)}>
                    Add a passenger
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white p-3 h-12"
              onClick={handleAddressSearch}
              disabled={!pickup || !dropoff}
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Updated modal for pickup time selection */}
      {pickupTimeModalOpen && (
        <PickupTimeModal 
          onClose={() => setPickupTimeModalOpen(false)} 
          onSelect={handlePickupTimeSelect} 
        />
      )}

      {/* Rider selection modal */}
      {riderModalOpen && (
        <RiderSelectionModal 
          onClose={() => setRiderModalOpen(false)} 
          onSelect={handleRiderSelect}
        />
      )}
    </div>
  );
};

export default RidePage;
