import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Clock, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useAppDispatch } from "@/store";
import { clearLastSearch, setLastSearch } from "@/store/slices/rideSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCustomerLoggedIn, customerProfile } = useUser();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupTime, setPickupTime] = useState("Now");
  
  // Get recent rides from localStorage (if any)
  const recentRides = customerProfile?.ridesHistory || [];

  // Clear the last search when component mounts
  useEffect(() => {
    dispatch(clearLastSearch());
    
    // Clear pickup and dropoff from session storage
    sessionStorage.removeItem('pickup');
    sessionStorage.removeItem('dropoff');
  }, [dispatch]);

  const handleRideSearch = () => {
    if (pickup && destination) {
      // Save pickup and destination to Redux
      dispatch(setLastSearch({ pickup, dropoff: destination }));
      
      // Go directly to ride selection
      navigate('/ride?selection=true');
    }
  };

  const handleRideOptionClick = (rideType: string) => {
    navigate(`/ride?type=${rideType}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left side - Ride Request Form */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <h1 className="text-5xl font-bold mb-8">Go anywhere with Uber</h1>
              
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="space-y-4 mb-4">
                {/* Pickup location */}
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                </div>
                
                {/* Destination */}
                <div className="relative">
                  <div className="absolute top-3 left-3">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                </div>
                
              <div className="flex space-x-4 mb-4">
                {/* Pickup time selector */}
                <Button variant="outline" className="flex items-center justify-between w-1/2 border border-gray-300 p-2">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                    <span>Today</span>
                    </div>
                  </Button>
                  
                {/* Time selector */}
                <Button variant="outline" className="flex items-center justify-between w-1/2 border border-gray-300 p-2">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                    <span>{pickupTime}</span>
                        </div>
                      </Button>
                </div>
                
                <Button 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-md"
                onClick={handleRideSearch}
                disabled={!pickup || !destination}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
            </div>
            
            {recentRides.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">View your recent activity</h3>
                <div className="divide-y divide-gray-200">
                  {recentRides.slice(0, 3).map((ride, index) => (
                    <div key={index} className="py-3 cursor-pointer hover:bg-gray-50 rounded">
                      <div className="flex items-start">
                        <div className="bg-gray-200 p-2 rounded-full mr-4">
                          <Car className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">{ride.destination}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(ride.date).toLocaleDateString()} • ${ride.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Map or Image */}
          <div className="w-full md:w-1/2 lg:w-7/12 mt-8 md:mt-0">
            <div className="h-96 md:h-full bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-[url('/map-background.jpg')] bg-cover bg-center">
                {/* Map interface would go here in a real implementation */}
                <div className="h-full flex items-center justify-center">
                  <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
                    <MapPin className="h-10 w-10 mx-auto mb-3 text-black" />
                    <p className="text-center font-medium">Map view will be shown here when you select locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggestions */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Suggestions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              className="bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRideOptionClick('hourly')}
            >
              <h3 className="text-xl font-medium mb-1">Hourly</h3>
              <p className="text-gray-600 mb-4">Book by the hour to run errands or explore a new city</p>
            </div>
            
            <div 
              className="bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRideOptionClick('reserve')}
                >
              <h3 className="text-xl font-medium mb-1">Reserve</h3>
              <p className="text-gray-600 mb-4">Schedule your ride in advance for peace of mind</p>
            </div>
            
            <div 
              className="bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRideOptionClick('group')}
            >
              <h3 className="text-xl font-medium mb-1">Group Ride</h3>
              <p className="text-gray-600 mb-4">Travel with friends and split the fare automatically</p>
                  </div>
                </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-20 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black">About us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Our offerings</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Newsroom</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Investors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black">Ride</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Drive</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Deliver</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Business</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Contact us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Safety</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">COVID-19 resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-black">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Uber Technologies Inc.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
