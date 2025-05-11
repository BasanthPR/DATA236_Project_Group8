import React, { useState, useEffect } from "react";
import { ArrowLeft, Car, Settings, Check, CreditCard, ChevronDown, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Map from "./Map";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface RideSelectionScreenProps {
  pickupLocation: string;
  dropoffLocation: string;
  onBack: () => void;
  onRideSelected: (rideType: string, price: number) => void;
  initialRideType?: string;
}

const RideSelectionScreen: React.FC<RideSelectionScreenProps> = ({
  pickupLocation,
  dropoffLocation,
  onBack,
  onRideSelected,
  initialRideType
}) => {
  const navigate = useNavigate();
  const { customerProfile, isCustomerLoggedIn } = useUser();
  const [selectedRide, setSelectedRide] = useState("UberX");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isConfirmingRide, setIsConfirmingRide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial ride type if provided
  useEffect(() => {
    if (initialRideType) {
      setSelectedRide(initialRideType);
    }
  }, [initialRideType]);

  // Check if user is logged in
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      navigate('/login');
    }
    
    // Select default payment method if available
    if (customerProfile?.paymentMethods && customerProfile.paymentMethods.length > 0) {
      const defaultMethod = customerProfile.paymentMethods.find(pm => pm.isDefault);
      setSelectedPaymentMethod(defaultMethod?.id || customerProfile.paymentMethods[0].id);
    }
  }, [isCustomerLoggedIn, navigate, customerProfile]);

  // Only UberX option as configured
  const rideOption = {
    id: "UberX",
    name: "UberX",
    description: "Up to 4 passengers",
    price: 24.99,
    eta: "4 min"
  };

  const getPaymentMethodDetails = (id: string) => {
    if (!customerProfile?.paymentMethods) return null;
    return customerProfile.paymentMethods.find(pm => pm.id === id);
  };

  const selectedMethod = selectedPaymentMethod ? getPaymentMethodDetails(selectedPaymentMethod) : null;

  const handleContinueToConfirm = () => {
    setIsConfirmingRide(true);
  };

  const handleBackFromConfirm = () => {
    setIsConfirmingRide(false);
  };

  const handleConfirmRide = () => {
    setIsLoading(true);
    
    // Simulate a short delay to show loading state
    setTimeout(() => {
      onRideSelected(selectedRide, rideOption.price);
      setIsLoading(false);
    }, 800);
  };

  // Main ride selection screen
  if (!isConfirmingRide) {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
        <div className="relative h-2/5">
        {/* Map area */}
        <Map 
          pickupLocation={[-122.1430, 37.4419]} // Palo Alto
          dropoffLocation={[-122.0841, 37.3893]} // Mountain View
          className="w-full h-full"
        />
        
        {/* Back button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 bg-white rounded-full w-10 h-10"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
        <div className="flex-1 bg-white rounded-t-3xl -mt-6 overflow-hidden flex flex-col">
          <div className="p-4 w-full max-w-md mx-auto overflow-y-auto flex-grow">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Choose a ride</h2>
          
            {/* Single ride option */}
            <div className="mb-4">
          <div
                className="border border-black rounded-lg p-4 flex items-center justify-between cursor-pointer bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <Car className="h-12 w-12" />
              <div>
                    <p className="font-medium">{rideOption.name}</p>
                    <p className="text-sm text-gray-500">{rideOption.description}</p>
              </div>
            </div>
            <div className="text-right">
                  <p className="font-bold">${rideOption.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{rideOption.eta}</p>
                </div>
            </div>
          </div>
          
          {/* Payment method */}
          <div className="mt-6">
            <p className="font-medium mb-2">Payment</p>
            
            {customerProfile?.paymentMethods && customerProfile.paymentMethods.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between flex items-center h-auto py-3"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {selectedMethod ? (
                        <span>
                          {selectedMethod.type} •••• {selectedMethod.last4Digits}
                        </span>
                      ) : (
                        <span>Select payment method</span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  {customerProfile.paymentMethods.map(method => (
                    <DropdownMenuItem
                      key={method.id}
                      className="flex items-center justify-between py-2"
                      onSelect={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>
                          {method.type} •••• {method.last4Digits}
                        </span>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Add payment method</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start flex items-center h-auto py-3"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add payment method
              </Button>
            )}
          </div>
          
          {/* Ride details */}
          <div className="my-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="flex-1">{pickupLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="flex-1">{dropoffLocation}</p>
              </div>
            </div>
          </div>
          
          {/* Fixed button at the bottom */}
          <div className="p-4 bg-white border-t border-gray-200 w-full max-w-md mx-auto">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg"
            disabled={!selectedPaymentMethod}
              onClick={handleContinueToConfirm}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Confirmation screen with price details
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="relative h-2/5">
        {/* Map area */}
        <Map 
          pickupLocation={[-122.1430, 37.4419]} // Palo Alto
          dropoffLocation={[-122.0841, 37.3893]} // Mountain View
          className="w-full h-full"
        />
        
        {/* Back button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 bg-white rounded-full w-10 h-10"
          onClick={handleBackFromConfirm}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 overflow-hidden flex flex-col">
        <div className="p-4 w-full max-w-md mx-auto overflow-y-auto flex-grow">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Confirm your ride</h2>
          
          {/* Ride details */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="flex-1">{pickupLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="flex-1">{dropoffLocation}</p>
            </div>
          </div>
          
          {/* Price breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                <span className="font-medium">{rideOption.name}</span>
              </div>
              <span>{rideOption.eta} away</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-bold mb-2">Fare breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>$19.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance (5.2 mi)</span>
                  <span>$2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Time (15 min)</span>
                  <span>$1.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking fee</span>
                  <span>$1.00</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${rideOption.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment method */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {selectedMethod ? (
                <span>
                  {selectedMethod.type} •••• {selectedMethod.last4Digits}
                </span>
              ) : (
                <span>Select payment method</span>
              )}
            </div>
            <Button variant="ghost" size="sm">
              Change
            </Button>
          </div>
          
          {/* Additional info */}
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">Your driver will arrive in approximately {rideOption.eta}</span>
          </div>
        </div>
        
        {/* Fixed request button at the bottom */}
        <div className="p-4 bg-white border-t border-gray-200 w-full max-w-md mx-auto">
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg relative"
            disabled={!selectedPaymentMethod || isLoading}
            onClick={handleConfirmRide}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Finding your driver...</span>
              </>
            ) : (
              <>
                <span>Request UberX • ${rideOption.price.toFixed(2)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideSelectionScreen;
