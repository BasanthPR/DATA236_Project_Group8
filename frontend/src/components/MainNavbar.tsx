import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white z-50 h-16">
      <div className="h-full mx-auto max-w-7xl flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-white font-bold text-2xl">
            Uber
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/ride" className="text-white hover:text-gray-300 transition-colors">
              Ride
            </Link>
            <Link to="/drive" className="text-white hover:text-gray-300 transition-colors">
              Drive
            </Link>
            <a href="https://www.uber.com/us/en/business/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
              Business
            </a>
            <a href="https://www.uber.com/us/en/deliver/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
              Deliver
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <form action="https://www.uber.com/search" method="get" target="_blank">
              <input
                type="text"
                name="q"
                placeholder="Search Uber.com"
                className="py-2 pl-10 pr-4 bg-gray-100 text-black rounded-full w-full max-w-xs focus:outline-none"
              />
            </form>
          </div>
          
          <a href="https://help.uber.com/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="text-white">
              Help
            </Button>
          </a>
          
          <div className="flex items-center space-x-2">
          <Link to="/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              Log in
            </Button>
          </Link>
          
          <Link to="/signup">
            <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-100">
              Sign up
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
