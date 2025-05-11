import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Car, User, Clipboard, Settings, LogOut, ChevronRight, Save, X, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateDriverAvailableRides, acceptRideRequest, startRide, completeRide } from "@/store/slices/rideSlice";
import Map from "@/components/Map";

const DriverDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    driverProfile, 
    isDriverLoggedIn, 
    logoutDriver,
    updateDriverProfile
  } = useUser();
  
  const { availableRides } = useAppSelector(state => state.ride);
  
  const [online, setOnline] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number]>([-122.4194, 37.7749]); // San Francisco
  const [activeRide, setActiveRide] = useState<any | null>(null);
  const [showNewRideAlert, setShowNewRideAlert] = useState(false);
  const [newRide, setNewRide] = useState<any | null>(null);
  const [notifications, setNotifications] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [driverAvailableRides, setDriverAvailableRides] = useState<any[]>([]);
  const [showRideRequests, setShowRideRequests] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Check if driver is logged in
  useEffect(() => {
    if (!isDriverLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to access your dashboard",
        variant: "destructive"
      });
      navigate('/driver/login');
      return;
    }
    
    // Force profile check - if we don't have a driver profile but isDriverLoggedIn is true, log them out
    if (!driverProfile) {
      logoutDriver();
      toast({
        title: "Profile Error",
        description: "Your driver profile couldn't be loaded. Please login again.",
        variant: "destructive"
      });
      navigate('/driver/login');
      return;
    }
  }, [isDriverLoggedIn, navigate, driverProfile, logoutDriver]);

  // Initialize edit profile state when driver profile is loaded
  useEffect(() => {
    if (driverProfile) {
      setEditedProfile({ ...driverProfile });
    }
  }, [driverProfile]);

  // Update driver available rides whenever availableRides changes or online status changes
  useEffect(() => {
    if (driverProfile && online) {
      // Dispatch the updateDriverAvailableRides action with the driver ID
      dispatch(updateDriverAvailableRides(driverProfile.id));
      
      console.log("Driver available rides updated - Driver ID:", driverProfile.id);
      console.log("Available rides in store:", availableRides);
    } else if (!online) {
      // Clear driver available rides when going offline
      dispatch(updateDriverAvailableRides(undefined));
    }
  }, [availableRides, online, driverProfile, dispatch]);

  // Get available rides from Redux store
  const driverRides = useAppSelector(state => state.ride.driverAvailableRides);

  // Update local state with rides from Redux store
  useEffect(() => {
    if (driverRides && driverRides.length > 0) {
      console.log("Driver rides from Redux:", driverRides);
      setDriverAvailableRides(driverRides);
      
      // If there's a new ride request and no active alert, show it
      const requestedRides = driverRides.filter(ride => ride.status === 'requested');
      if (requestedRides.length > 0 && !showNewRideAlert && !newRide && online) {
        const latestRide = requestedRides[0];
        setNewRide(latestRide);
            setShowNewRideAlert(true);
            setNotifications(prev => prev + 1);
            
            // Play sound alert
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869.wav');
            audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (error) {
          console.error('Error playing sound:', error);
        }
      }
    } else {
      // Ensure we don't have stale data if there are no rides
      setDriverAvailableRides([]);
    }
  }, [driverRides, showNewRideAlert, newRide, online]);

  // Keep track of active ride
  useEffect(() => {
    if (!driverProfile) return;
    
    const myRides = driverAvailableRides.filter(ride => 
      (ride.status === 'accepted' || ride.status === 'started') && 
      ride.driverId === driverProfile.id
    );
    
    if (myRides.length > 0) {
      setActiveRide(myRides[0]);
    } else {
      setActiveRide(null);
    }
  }, [driverAvailableRides, driverProfile]);

  const handleToggleOnline = () => {
    setIsLoading(true);
    
    // Short delay to simulate connecting to the server
    setTimeout(() => {
      const newOnlineStatus = !online;
      setOnline(newOnlineStatus);
      
      if (newOnlineStatus) {
        // Going online - update available rides
        if (driverProfile) {
          dispatch(updateDriverAvailableRides(driverProfile.id));
          
          // Simulate getting location
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates([position.coords.longitude, position.coords.latitude]);
            },
            (error) => {
              console.error("Error getting location:", error);
              // Use default location if geolocation fails
              setCoordinates([-122.4194, 37.7749]); // San Francisco
            }
          );
        }
        
        toast({
          title: "You're online",
          description: "You'll now receive ride requests",
        });
      } else {
        // Going offline - clear ride alerts
        setShowNewRideAlert(false);
        setNewRide(null);
        dispatch(updateDriverAvailableRides(undefined));
        
    toast({
          title: "You're offline",
          description: "You won't receive any ride requests",
    });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleNotificationClick = () => {
    setNotifications(0);
    
    // Force update ride requests from Redux
    if (driverProfile && online) {
      dispatch(updateDriverAvailableRides(driverProfile.id));
    }
    
    const requestCount = driverAvailableRides.filter(ride => ride.status === 'requested').length;
    const activeCount = driverAvailableRides.filter(ride => 
      (ride.status === 'accepted' || ride.status === 'started') && 
      ride.driverId === driverProfile?.id
    ).length;
    
    toast({
      title: "Notifications",
      description: `You have ${requestCount} ride request(s) and ${activeCount} active ride(s)`,
    });

    // Show the ride requests panel
    setShowRideRequests(true);
  };

  const handleAcceptRide = (ride: any) => {
    if (!driverProfile) return;
    
    setIsLoading(true);
    
    // Accept the ride through Redux
    dispatch(acceptRideRequest({ 
      rideId: ride.id, 
      driverId: driverProfile.id 
    }));
    
    // Short delay to simulate processing
    setTimeout(() => {
    setShowNewRideAlert(false);
    setNewRide(null);
      
      // Force update ride requests
      dispatch(updateDriverAvailableRides(driverProfile.id));
    
    toast({
      title: "Ride Accepted",
        description: `You've accepted the ride to ${ride.dropoffLocation}`,
    });
      
      setIsLoading(false);
    }, 800);
  };

  const handleRejectRide = () => {
    // Just close the alert, ride will still be available for other drivers
    setShowNewRideAlert(false);
    setNewRide(null);
    
    toast({
      title: "Ride Rejected",
      description: "You've rejected the ride request",
    });
  };

  const handleStartRide = (ride: any) => {
    setIsLoading(true);
    
    // Update ride status to started
    dispatch(startRide(ride.id));
    
    // Short delay to simulate processing
    setTimeout(() => {
      // Force update driver's available rides
      if (driverProfile) {
        dispatch(updateDriverAvailableRides(driverProfile.id));
      }
      
    toast({
      title: "Ride Started",
      description: "You've started the ride. Drive safely!",
    });
    
      setIsLoading(false);
    }, 800);
  };

  const handleCompleteRide = (ride: any) => {
    setIsLoading(true);
    
    dispatch(completeRide(ride.id));
    
    // Short delay to simulate processing
    setTimeout(() => {
      // Force update driver's available rides
      if (driverProfile) {
        dispatch(updateDriverAvailableRides(driverProfile.id));
      }
      
      toast({
        title: "Ride Completed",
        description: `You've completed the ride to ${ride.dropoffLocation}`,
      });
      
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    logoutDriver();
    setOnline(false);
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your driver account."
    });
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (tab === "home") {
      setShowSidebar(false);
    }
    // Reset edit mode when switching tabs
    setEditMode(false);
  };

  const handleProfileEdit = (field: string, value: string) => {
    if (!editedProfile) return;
    
    if (field.includes('.')) {
      // Handle nested fields like 'carDetails.make'
      const [parent, child] = field.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = () => {
    if (!editedProfile) return;
    
    updateDriverProfile(editedProfile);
    setEditMode(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  if (!driverProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading driver profile...</p>
      </div>
    );
  }

  // Create a debug button to add test ride requests (for development only)
  const addTestRideRequest = () => {
    // This would be removed in production
    const testRide = {
      customerId: "test-customer",
      pickupLocation: "123 Test St, Palo Alto",
      dropoffLocation: "456 Sample Ave, Mountain View",
      pickupCoordinates: [-122.1430, 37.4419] as [number, number],
      dropoffCoordinates: [-122.0841, 37.3893] as [number, number],
      price: 25.50,
      currency: "USD",
      distance: 5.2,
      duration: 15,
      rideType: "UberX",
      customerName: "Test User",
      customerRating: 4.8,
      paymentMethod: "test-payment",
      paymentStatus: "pending"
    };
    
    // Manually create a ride for testing
    const rideId = `ride-${Date.now()}`;
    const newRide = {
      id: rideId,
      status: 'requested',
      ...testRide,
      requestTime: new Date().toISOString()
    };
    
    // Add to session storage
    const existingRides = JSON.parse(sessionStorage.getItem('availableRides') || '[]');
    existingRides.push(newRide);
    sessionStorage.setItem('availableRides', JSON.stringify(existingRides));
    
    // Refresh the page to load the new ride
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Top Navigation */}
      <div className="bg-black text-white p-4 flex justify-between items-center z-50">
        <div className="text-xl font-bold">Uber Driver</div>
        <div className="flex items-center space-x-4">
          <button 
            className="relative cursor-pointer" 
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </button>
          <button 
            onClick={handleToggleOnline} 
            className={`px-4 py-1 rounded-full cursor-pointer relative ${online ? 'bg-green-500' : 'bg-gray-500'}`}
            aria-label={online ? "Go Offline" : "Go Online"}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-pulse">{online ? 'Going offline' : 'Going online'}...</span>
              </span>
            ) : (
              <span>{online ? 'Online' : 'Offline'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar - show when button is clicked */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 relative h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3 mb-6 mt-4">
            <div className="bg-gray-200 rounded-full p-2">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold">{`${driverProfile.firstName} ${driverProfile.lastName}`}</h3>
              <div className="text-sm text-gray-600">
                Rating: {driverProfile.rating} ⭐
              </div>
            </div>
          </div>
          
          <ul className="space-y-4 mb-24 flex-grow">
            <li>
              <button 
                onClick={() => handleTabChange("home")}
                className={`flex items-center w-full p-2 rounded-md ${selectedTab === "home" ? "bg-gray-100" : ""}`}
              >
                <Car className="h-5 w-5 mr-3" />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange("earnings")}
                className={`flex items-center w-full p-2 rounded-md ${selectedTab === "earnings" ? "bg-gray-100" : ""}`}
              >
                <Clipboard className="h-5 w-5 mr-3" />
                <span>Earnings</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleTabChange("account")}
                className={`flex items-center w-full p-2 rounded-md ${selectedTab === "account" ? "bg-gray-100" : ""}`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Account</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setShowRideRequests(!showRideRequests)}
                className="flex items-center w-full p-2 rounded-md bg-blue-50 text-blue-700"
              >
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>Ride Requests</span>
                {driverAvailableRides.filter(ride => ride.status === 'requested').length > 0 && (
                  <span className="ml-auto bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {driverAvailableRides.filter(ride => ride.status === 'requested').length}
                  </span>
                )}
              </button>
            </li>
          </ul>
          
          <div className="mt-auto mb-6">
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-500 p-2 w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)]">
        {/* Map takes the full area */}
        <Map 
          className="h-full w-full"
          driverLocation={coordinates}
          pickupLocation={activeRide?.pickupCoordinates}
          dropoffLocation={activeRide?.dropoffCoordinates}
        />
        
        {/* Toggle sidebar button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-20"
          aria-label="Menu"
        >
          <ChevronRight className={`h-6 w-6 transform transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Driver Info Panel */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gray-200 rounded-full p-2">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold">{`${driverProfile.firstName} ${driverProfile.lastName}`}</h3>
              <div className="text-sm text-gray-600">
                Rating: {driverProfile.rating} ⭐
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center space-x-2 text-sm mb-1">
              <Car className="h-4 w-4" />
              <span>{`${driverProfile.carDetails.year} ${driverProfile.carDetails.make} ${driverProfile.carDetails.model}`}</span>
            </div>
            <div className="text-sm text-gray-600">
              {driverProfile.carDetails.color} · {driverProfile.carDetails.licensePlate}
            </div>
          </div>
        </div>
        
        {/* Active Rides Panel */}
        {activeRide && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <h3 className="font-bold mb-2">Active Ride</h3>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{activeRide.dropoffLocation}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{activeRide.pickupLocation}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Fare:</span>
                <span className="font-medium">${activeRide.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{activeRide.customerName || "Customer"}</span>
              </div>
              {activeRide.status === 'accepted' && (
                <Button 
                  className="w-full mt-2 bg-green-500 hover:bg-green-600"
                  onClick={() => handleStartRide(activeRide)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Start Ride'}
                </Button>
              )}
              {activeRide.status === 'started' && (
                <Button 
                  className="w-full mt-2 bg-green-500 hover:bg-green-600"
                  onClick={() => handleCompleteRide(activeRide)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Complete Ride'}
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Ride Requests Panel - Always visible when online and ride requests exist */}
        {!activeRide && online && showRideRequests && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Available Ride Requests</h3>
              <button 
                onClick={() => setShowRideRequests(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {driverAvailableRides.filter(ride => ride.status === 'requested').length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-4">
                {driverAvailableRides.filter(ride => ride.status === 'requested').map((ride, index) => (
                  <div key={ride.id} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">{ride.customerName || "Customer"}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {ride.distance} miles • Est. ${ride.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">PICKUP</p>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                          <p className="font-medium text-sm truncate">{ride.pickupLocation}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">DROPOFF</p>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                          <p className="font-medium text-sm truncate">{ride.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-1/2"
                        onClick={() => handleRejectRide()}
                        disabled={isLoading}
                      >
                        Reject
                      </Button>
                      <Button 
                        className="w-1/2 bg-black text-white"
                        size="sm"
                        onClick={() => handleAcceptRide(ride)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Accept'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No ride requests at the moment.</p>
                <p className="text-sm text-gray-400">New requests will appear here.</p>
                
                {/* Development testing button - would be removed in production */}
                <Button 
                  variant="outline" 
                  className="mt-4 text-xs"
                  onClick={addTestRideRequest}
                >
                  Add Test Ride (Dev Only)
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* New Ride Alert Modal */}
        {showNewRideAlert && newRide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-2">New Ride Request!</h3>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{newRide.customerName || "Customer"}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm">{newRide.customerRating || 5.0}</span>
                  </div>
                </div>
              </div>
              <div className="my-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{newRide.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{newRide.dropoffLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{newRide.distance} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fare:</span>
                  <span className="font-medium">${newRide.price.toFixed(2)}</span>
                </div>
                {newRide.rideType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ride Type:</span>
                    <span className="font-medium">{newRide.rideType}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRejectRide}
                  disabled={isLoading}
                >
                  Reject
                </Button>
                <Button 
                  className="flex-1 bg-black text-white"
                  onClick={() => handleAcceptRide(newRide)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Accept'}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Account Tab Content */}
        {selectedTab === "account" && (
          <div className="absolute inset-0 bg-white z-30 overflow-y-auto">
            <div className="p-6 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>
                {editMode ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSaveProfile}
                      className="flex items-center"
                      variant="default"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditMode(false);
                        setEditedProfile({...driverProfile});
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setEditMode(true)}
                    variant="outline"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {editedProfile && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">First Name</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.firstName}
                              onChange={(e) => handleProfileEdit('firstName', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.firstName}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Last Name</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.lastName}
                              onChange={(e) => handleProfileEdit('lastName', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.lastName}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.phoneNumber}
                              onChange={(e) => handleProfileEdit('phoneNumber', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.phoneNumber}</p>
                          )}
                        </div>
                    <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.email}
                              onChange={(e) => handleProfileEdit('email', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.email}</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Address</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.address}
                              onChange={(e) => handleProfileEdit('address', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Year</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.carDetails.year}
                              onChange={(e) => handleProfileEdit('carDetails.year', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.carDetails.year}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Make</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.carDetails.make}
                              onChange={(e) => handleProfileEdit('carDetails.make', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.carDetails.make}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Model</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.carDetails.model}
                              onChange={(e) => handleProfileEdit('carDetails.model', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.carDetails.model}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Color</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.carDetails.color}
                              onChange={(e) => handleProfileEdit('carDetails.color', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.carDetails.color}</p>
                          )}
                    </div>
                    <div>
                          <p className="text-sm text-gray-500 mb-1">License Plate</p>
                          {editMode ? (
                            <Input 
                              value={editedProfile.carDetails.licensePlate}
                              onChange={(e) => handleProfileEdit('carDetails.licensePlate', e.target.value)}
                            />
                          ) : (
                            <p>{editedProfile.carDetails.licensePlate}</p>
                      )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => handleTabChange("home")}
              >
                Back to Dashboard
              </Button>
              
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      
        {/* Earnings Tab Content */}
        {selectedTab === "earnings" && (
          <div className="absolute inset-0 bg-white z-30 overflow-y-auto">
            <div className="p-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-6">Your Earnings</h2>
              
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Current Balance</h3>
                <p className="text-3xl font-bold">${(driverProfile.ridesHistory.reduce((acc, ride) => acc + ride.fare, 0)).toFixed(2)}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Recent Trips</h3>
                {driverProfile.ridesHistory.length > 0 ? (
                  <div className="space-y-3">
                    {driverProfile.ridesHistory.map((ride, index) => (
                      <div key={ride.id || index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Trip to {ride.dropoffLocation}</span>
                          <span className="font-bold">${ride.fare.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(ride.date).toLocaleDateString()} • {ride.pickupLocation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No trips yet. Go online to start earning!</p>
                )}
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleTabChange("home")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboardPage;
