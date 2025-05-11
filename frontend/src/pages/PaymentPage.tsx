import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Check, Clock, MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateRideStatus, completeRide } from "@/store/slices/rideSlice";
import Map from "@/components/Map";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customerProfile, isCustomerLoggedIn } = useUser();
  const { activeRide } = useAppSelector(state => state.ride);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [driverEta, setDriverEta] = useState("3 min");
  const [driverName, setDriverName] = useState("");
  const [driverRating, setDriverRating] = useState(0);
  const [driverVehicle, setDriverVehicle] = useState("");
  const [driverLicense, setDriverLicense] = useState("");

  // Check if user is logged in and a ride is active
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to complete your payment",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!activeRide) {
      toast({
        title: "No Active Ride",
        description: "You don't have an active ride to pay for",
        variant: "destructive"
      });
      navigate('/ride');
      return;
    }
    
    // Select default payment method if available
    if (customerProfile?.paymentMethods && customerProfile.paymentMethods.length > 0) {
      const defaultMethod = customerProfile.paymentMethods.find(pm => pm.isDefault);
      setSelectedPaymentMethod(defaultMethod?.id || customerProfile.paymentMethods[0].id);
    }

    // Simulate fetch of driver data
    if (activeRide.status === 'accepted' && activeRide.driverId) {
      // In a real app, this would be a fetch to get driver details
      setDriverName("Michael Johnson");
      setDriverRating(4.87);
      setDriverVehicle("Toyota Camry (White)");
      setDriverLicense("ABC 123");
      
      // Simulate ETA calculation
      setDriverEta(Math.floor(Math.random() * 5 + 1) + " min");
    }
  }, [isCustomerLoggedIn, navigate, customerProfile, activeRide]);

  const handleCompletePayment = () => {
    if (!selectedPaymentMethod || !activeRide) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Update ride with payment info
    dispatch(updateRideStatus({
      rideId: activeRide.id,
      newStatus: 'completed'
    }));
    
    // Update payment status
    // In a real app, this would call a payment processing service
    
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful",
        description: "Your ride has been completed and payment processed.",
      });
      dispatch(completeRide(activeRide.id));
      navigate('/activity');
    }, 2000);
  };

  const getPaymentMethodDetails = (id: string) => {
    if (!customerProfile?.paymentMethods) return null;
    return customerProfile.paymentMethods.find(pm => pm.id === id);
  };

  const selectedMethod = selectedPaymentMethod ? getPaymentMethodDetails(selectedPaymentMethod) : null;

  if (!activeRide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No active ride found. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-2">
          {activeRide.status === 'completed' ? 'Payment' : 'Ride in Progress'}
        </h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        {/* Map area (smaller) */}
        <div className="w-full h-56">
          <Map 
            pickupLocation={activeRide.pickupCoordinates}
            dropoffLocation={activeRide.dropoffCoordinates}
            className="h-full w-full"
          />
        </div>
        
        {/* Ride/Payment content */}
        <div className="bg-white rounded-t-3xl relative -mt-6 w-full max-w-md mx-auto shadow-lg flex-1">
          <div className="p-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{activeRide.rideType || 'UberX'}</h2>
            
            {activeRide.status === 'accepted' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <Car className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{driverName}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm">{driverRating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{driverVehicle} • {driverLicense}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  {activeRide.status === 'requested' && (
                    <>
                      <p className="font-medium">Finding your driver</p>
                      <p className="text-sm text-gray-500">Please wait a moment</p>
                    </>
                  )}
                  {activeRide.status === 'accepted' && (
                    <>
                      <p className="font-medium">Arriving in {driverEta}</p>
                  <p className="text-sm text-gray-500">Driver is on the way</p>
                    </>
                  )}
                  {activeRide.status === 'started' && (
                    <>
                      <p className="font-medium">Ride in progress</p>
                      <p className="text-sm text-gray-500">Estimated arrival in {Math.floor(Math.random() * 10 + 5)} min</p>
                    </>
                  )}
                  {activeRide.status === 'completed' && (
                    <>
                      <p className="font-medium">Ride completed</p>
                      <p className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <div className="w-5 flex flex-col items-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="font-medium">{activeRide.pickupLocation}</p>
                    <p className="text-sm text-gray-500">Pickup location</p>
                  </div>
                  <div>
                    <p className="font-medium">{activeRide.dropoffLocation}</p>
                    <p className="text-sm text-gray-500">Dropoff location</p>
                  </div>
                </div>
              </div>
            </div>
            
            {activeRide.status === 'completed' && (
              <>
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Payment Method</h3>
              
              {customerProfile?.paymentMethods && customerProfile.paymentMethods.length > 0 ? (
                <div className="space-y-2">
                  {customerProfile.paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${selectedPaymentMethod === method.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">
                            {method.type} •••• {method.last4Digits}
                          </p>
                        </div>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <Check className="h-5 w-5" />
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">
                    Add payment method
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-2">No payment methods available</p>
                  <Button variant="outline">
                    Add payment method
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-black font-medium">Base fare</span>
                    <span className="text-black font-medium">${(activeRide.price * 0.8).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-black font-medium">Service fee</span>
                    <span className="text-black font-medium">${(activeRide.price * 0.2).toFixed(2)}</span>
                  </div>
                  {activeRide.distance && (
                    <div className="flex justify-between mb-2">
                      <span className="text-black font-medium">Distance</span>
                      <span className="text-black font-medium">{activeRide.distance.toFixed(1)} miles</span>
              </div>
                  )}
              <div className="flex justify-between font-bold text-lg">
                <span className="text-black">Total</span>
                    <span className="text-black">${activeRide.price.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white"
              onClick={handleCompletePayment}
              disabled={isProcessing || !selectedPaymentMethod}
            >
                  {isProcessing ? "Processing..." : `Pay $${activeRide.price.toFixed(2)}`}
                </Button>
              </>
            )}
            
            {activeRide.status === 'started' && (
              <div className="mt-4">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Ride in Progress</h3>
                  <p className="text-sm text-gray-600">
                    Your driver is taking you to your destination. Payment will be processed when your ride is complete.
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            )}
            
            {activeRide.status === 'accepted' && (
              <div className="mt-4">
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium mb-2">Driver on the way</h3>
                  <p className="text-sm text-gray-600">
                    Your driver is coming to pick you up. Please be ready at the pickup location.
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            )}
            
            {activeRide.status === 'requested' && (
              <div className="mt-4">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Finding a driver</h3>
                  <p className="text-sm text-gray-600">
                    Please wait while we connect you with a nearby driver.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-t-black border-gray-200 rounded-full animate-spin"></div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/ride')}
                >
                  Back to Ride
            </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
