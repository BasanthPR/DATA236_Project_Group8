
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Map from "@/components/Map";
import RideNavbar from "@/components/RideNavbar";

const DeliverPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <RideNavbar />
      
      <div className="flex-1 relative pt-16">
        {/* Map background */}
        <Map className="h-full w-full absolute inset-0" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4">Service Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Uber Courier service is currently unavailable in your region. We apologize for the inconvenience.
            </p>
            <p className="text-gray-600 mb-8">
              Please check back later as we continue to expand our services.
            </p>
            
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white p-3"
              onClick={handleBackToHome}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverPage;
