import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const RideNavbar = () => {
  // Get current path to highlight active link
  const currentPath = window.location.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 shadow-sm">
      <div className="h-full mx-auto flex items-center px-4 md:px-8">
        <div className="flex items-center mr-12">
          <Link to="/" className="text-black font-bold text-2xl">
            Uber
          </Link>
        </div>
        
        <nav className="flex overflow-x-auto hide-scrollbar">
          <Link 
            to="/ride" 
            className={`flex items-center py-4 px-2 md:px-4 whitespace-nowrap ${
              currentPath === "/ride" ? "border-b-2 border-black text-black font-medium" : "text-gray-500 font-medium hover:text-black"
            }`}
          >
            <Car className="h-5 w-5 mr-2" />
            Ride
          </Link>
          
          {/* Removing Rental Cars and Hourly links as requested */}
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link 
            to="/activity" 
            className="text-black font-medium hover:text-gray-700 transition-colors"
          >
            Activity
          </Link>
          
          <Link to="/profile">
            <div 
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              aria-label="Profile"
            >
              <span className="sr-only">Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default RideNavbar;
