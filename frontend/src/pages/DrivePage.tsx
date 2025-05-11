import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainNavbar from "@/components/MainNavbar";
import Map from "@/components/Map";
import { Car, CheckCircle, DollarSign, Shield } from "lucide-react";

const DriveNav = () => (
  <div className="border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <nav className="flex space-x-8 overflow-x-auto">
        <Link 
          to="/drive" 
          className="text-black font-medium py-4 px-1 border-b-2 border-black whitespace-nowrap"
        >
          Driving overview
        </Link>
        <a 
          href="https://www.uber.com/us/en/drive/requirements/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Driving requirements
        </a>
        <a 
          href="https://www.uber.com/us/en/drive/basics/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Driving basics
        </a>
        <a 
          href="https://www.uber.com/us/en/drive/how-much-drivers-make/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Earnings
        </a>
        <a 
          href="https://www.uber.com/us/en/drive/vehicle-solutions/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Vehicle solutions
        </a>
        <a 
          href="https://www.uber.com/us/en/drive/safety/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Safety
        </a>
        <a 
          href="https://help.uber.com/driving-and-delivering" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 font-medium py-4 px-1 hover:text-black whitespace-nowrap"
        >
          Contact us
        </a>
      </nav>
    </div>
  </div>
);

const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-gray-900 p-6 rounded-lg flex flex-col h-full">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 mb-4">{description}</p>
  </div>
);

const DrivePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<[number, number]>([-122.4194, 37.7749]); // San Francisco

  const handleGetStarted = () => {
    navigate('/driver/signup');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MainNavbar />
      
      <div className="pt-16 bg-black">
        <div className="py-4">
          <h1 className="text-3xl font-bold px-4 md:px-8">Drive</h1>
        </div>
        
        <DriveNav />
      </div>
      
      <main className="flex-1 bg-black">
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h2 className="text-5xl font-bold mb-6">
                Drive when you want, make what you need
              </h2>
              <p className="text-xl mb-8">
                Earn on your own schedule.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-white text-black hover:bg-gray-200 px-6 py-3 h-auto text-lg"
                  onClick={handleGetStarted}
                >
                    Get started
                  </Button>
                
                <Link to="/driver/login" className="text-white hover:text-gray-300 flex items-center">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
            
            <div className="h-80 rounded-lg overflow-hidden">
              <Map 
                className="w-full h-full"
                driverLocation={location}
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Why drive with Uber</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BenefitCard 
              icon={<Car className="h-10 w-10 text-white" />}
              title="Flexible hours"
              description="You're the boss. Drive whenever it works for your schedule."
            />
            
            <BenefitCard 
              icon={<DollarSign className="h-10 w-10 text-white" />}
              title="Earnings tracker"
              description="Monitor your earnings and weekly payouts directly in the app."
            />
            
            <BenefitCard 
              icon={<Shield className="h-10 w-10 text-white" />}
              title="Safety features"
              description="Share your trip details with loved ones and access emergency assistance."
            />
          </div>
        </section>
        
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-gray-900 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">How driving with Uber works</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Sign up online</h3>
                    <p className="text-gray-300">Create your account and complete the required steps to become a driver.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Get approved</h3>
                    <p className="text-gray-300">Complete a background screening and add your documents to get approval to drive.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Start driving</h3>
                    <p className="text-gray-300">Download the driver app and start receiving ride requests when you're ready.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Requirements</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Valid driver's license</p>
                    <p className="text-gray-300 text-sm">Must have a valid driver's license in your state of residence</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Vehicle requirements</p>
                    <p className="text-gray-300 text-sm">Vehicle must be 10 years old or newer and in good condition</p>
              </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Driving experience</p>
                    <p className="text-gray-300 text-sm">At least 1-3 years of licensed driving experience</p>
            </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Background check</p>
                    <p className="text-gray-300 text-sm">Must pass a background screening</p>
              </div>
                </li>
              </ul>
              
              <Button 
                className="w-full mt-8 bg-white text-black hover:bg-gray-200"
                onClick={handleGetStarted}
              >
                Get started
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DrivePage;
