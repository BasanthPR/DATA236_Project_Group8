
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, CreditCard, Car, Package, Globe, ChevronDown } from "lucide-react";

const BusinessNavbar = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get username from localStorage if it exists
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white z-50 h-16">
      <div className="h-full mx-auto max-w-7xl flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link to="/business" className="text-white font-medium text-lg">
            <span className="text-white text-xl font-bold mr-1">Uber</span>
            for Business
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <div className="flex items-center text-white hover:text-gray-300 transition-colors">
              Overview
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <div className="flex items-center text-white hover:text-gray-300 transition-colors">
              Solutions
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <Link to="/business/pricing" className="text-white hover:text-gray-300 transition-colors">
              Pricing
            </Link>
            <div className="flex items-center text-white hover:text-gray-300 transition-colors">
              Customer support
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <div className="flex items-center text-white hover:text-gray-300 transition-colors">
              Resources
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-gray-800">
            Contact sales
          </Button>
          
          {username ? (
            <Link to="/profile">
              <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-100">
                {username}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-100">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

const BusinessPage = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get username from localStorage if it exists
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <BusinessNavbar />
      
      <main className="flex-1 pt-16">
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-black" />
              </div>
              <div className="h-0.5 w-12 bg-gray-500"></div>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-black" />
              </div>
              <div className="h-0.5 w-12 bg-gray-500"></div>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-black" />
              </div>
              <div className="h-0.5 w-12 bg-gray-500"></div>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-black" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {username ? (
                <h1 className="text-5xl font-bold mb-6">
                  Welcome, {username}.<br />
                  Let's get set up.
                </h1>
              ) : (
                <h1 className="text-5xl font-bold mb-6">
                  Elevate your business with Uber.
                </h1>
              )}
              
              <p className="text-xl mb-8">
                You're only a few steps away from setting up your company's Uber for Business account. With a single platform, you can create programs to meet all your employees' or customers' travel, meal, and gifting needs.
              </p>
              
              <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 h-auto text-lg">
                Sign up your company
              </Button>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-8 flex flex-col items-center justify-center h-full">
                <h3 className="text-black text-2xl font-bold mb-4">Business dashboard</h3>
                <p className="text-gray-600 text-center mb-6">Manage your business travel, expenses, and more in one place</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-black">
                    <p className="font-bold">Travel</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-black">
                    <p className="font-bold">Meals</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-black">
                    <p className="font-bold">Expenses</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-black">
                    <p className="font-bold">Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">What fits your company's needs?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-black border border-gray-700 rounded-lg overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4">Business Travel</h3>
              <p className="text-gray-400 mb-6">Simplify business travel with centralized billing and reporting</p>
              <Button variant="outline" className="text-white border-white">
                Learn more
              </Button>
            </div>
            
            <div className="bg-black border border-gray-700 rounded-lg overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4">Expense Management</h3>
              <p className="text-gray-400 mb-6">Streamline expenses with automatic receipt generation</p>
              <Button variant="outline" className="text-white border-white">
                Learn more
              </Button>
            </div>
            
            <div className="bg-black border border-gray-700 rounded-lg overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4">Customer Solutions</h3>
              <p className="text-gray-400 mb-6">Enhance customer experience with customized ride solutions</p>
              <Button variant="outline" className="text-white border-white">
                Learn more
              </Button>
            </div>
            
            <div className="bg-black border border-gray-700 rounded-lg overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-4">Executive Travel</h3>
              <p className="text-gray-400 mb-6">Premium travel options for your executive team</p>
              <Button variant="outline" className="text-white border-white">
                Learn more
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BusinessPage;
