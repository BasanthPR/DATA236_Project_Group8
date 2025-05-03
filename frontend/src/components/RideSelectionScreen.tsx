
import { useState } from "react";
import { MapPin, Clock, User, ChevronLeft, ChevronRight, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RideSelectionScreenProps {
  pickupLocation: string;
  dropoffLocation: string;
  onBack: () => void;
  onRideSelected: (rideType: string, price: number) => void;
}

const RideSelectionScreen = ({
  pickupLocation,
  dropoffLocation,
  onBack,
  onRideSelected,
}: RideSelectionScreenProps) => {
  const [selectedRide, setSelectedRide] = useState("UberX");
  const [mapCoordinates, setMapCoordinates] = useState<{
    pickup?: [number, number];
    dropoff?: [number, number];
  }>({
    pickup: [-122.4194, 37.7749], // San Francisco
    dropoff: [-122.2711, 37.8044], // Berkeley
  });

  // Sample ride options
  const rideOptions = [
    {
      id: "uberx",
      name: "UberX",
      passengers: 4,
      eta: "3 mins away",
      price: 16.91,
      time: "9:12 PM",
      description: "Affordable rides all to yourself",
    },
    {
      id: "share",
      name: "Share",
      passengers: 1,
      eta: "4 mins away",
      price: 15.27,
      time: "9:14 PM",
      description: "One seat only",
    },
    {
      id: "comfort",
      name: "Comfort Electric",
      passengers: 4,
      eta: "4 mins away",
      price: 21.75,
      time: "9:16 PM",
      description: "Newer zero-emission cars with extra legroom",
    },
    {
      id: "uberxl",
      name: "UberXL",
      passengers: 6,
      eta: "3 mins away",
      price: 21.10,
      time: "9:15 PM",
      description: "Affordable rides for groups up to 6",
    },
  ];

  // Sample payment methods
  const paymentMethods = [
    { id: "pm1", type: "Visa", last4: "4242", isDefault: true },
    { id: "pm2", type: "Mastercard", last4: "8765", isDefault: false },
    { id: "pm3", type: "PayPal", isDefault: false },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleRideSelection = (rideId: string) => {
    const ride = rideOptions.find((r) => r.id === rideId);
    setSelectedRide(ride?.name || "UberX");
  };

  const handleRequestRide = () => {
    const ride = rideOptions.find((r) => r.name === selectedRide);
    if (ride) {
      onRideSelected(ride.name, ride.price);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Map takes entire background */}
      <Map
        pickupLocation={mapCoordinates.pickup}
        dropoffLocation={mapCoordinates.dropoff}
        className="absolute inset-0 h-full w-full"
      />

      {/* Header */}
      <div className="relative z-10 bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="p-2" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Choose a ride</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Ride endpoints */}
        <div className="mt-2 flex items-center">
          <div className="flex flex-col items-center mr-2">
            <div className="h-2 w-2 rounded-full bg-black"></div>
            <div className="h-8 border-l border-dotted border-gray-400"></div>
            <div className="h-2 w-2 rounded-full bg-black"></div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium truncate">
              {pickupLocation || "Current location"}
            </div>
            <div className="mt-4 text-sm font-medium truncate">
              {dropoffLocation || "Destination"}
            </div>
          </div>
        </div>
      </div>

      {/* Ride options */}
      <div className="relative z-10 mt-auto bg-white rounded-t-3xl shadow-lg overflow-hidden max-h-[60vh] overflow-y-auto">
        <div className="p-4">
          {rideOptions.map((ride) => (
            <div
              key={ride.id}
              className={`flex items-center justify-between p-4 rounded-lg mb-2 cursor-pointer ${
                selectedRide === ride.name
                  ? "bg-primary/5 border border-primary"
                  : "bg-white border border-gray-200"
              }`}
              onClick={() => handleRideSelection(ride.id)}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <img
                    src={`/public/lovable-uploads/${ride.id === "share" ? "f94fc4fe-e575-4e59-8bae-dab7109a64f8" : "2b6f8291-5e94-4f94-a05f-49cd6a6bdc61"}.png`}
                    alt={ride.name}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">{ride.name}</h3>
                    <div className="ml-2 text-sm bg-gray-100 px-1 rounded">
                      {ride.passengers}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {ride.eta} • {ride.time}
                  </div>
                  <p className="text-sm text-gray-600">{ride.description}</p>
                </div>
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(ride.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between px-3 py-2 h-auto w-full">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span>Payment Method</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                  <h3 className="font-medium">Select Payment Method</h3>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <div>
                          <div className="font-medium">
                            {method.type}
                            {method.last4 && ` •••• ${method.last4}`}
                          </div>
                          {method.isDefault && (
                            <div className="text-xs text-gray-500">Default</div>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            className="w-full py-6 text-lg bg-black hover:bg-gray-800 text-white"
            onClick={handleRequestRide}
          >
            Request {selectedRide}
          </Button>
        </div>
      </div>

      {/* Zoom controls for map */}
      <div className="absolute bottom-72 right-4 z-10 flex flex-col bg-white rounded-lg shadow">
        <Button variant="ghost" className="p-2">
          <Plus className="h-5 w-5" />
        </Button>
        <div className="border-t border-gray-200"></div>
        <Button variant="ghost" className="p-2">
          <Minus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default RideSelectionScreen;
