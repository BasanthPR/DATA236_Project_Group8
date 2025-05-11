
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginCustomer } = useUser();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, just check if all fields are provided
    if (firstName && lastName && email && password) {
      // Create a customer profile
      const customerProfile = {
        id: `CUST-${Math.floor(Math.random() * 9000) + 1000}`,
        firstName,
        lastName,
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email,
        rating: 5.0,
        cardDetails: {
          last4Digits: "",
          cardType: "",
          expiryMonth: 0,
          expiryYear: 0
        },
        ridesHistory: [],
        reviews: [],
        paymentMethods: []
      };
      
      // Login the customer with the created profile
      loginCustomer(customerProfile);
      
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Account created",
          description: "Your account has been successfully created. Please complete your profile information."
        });
        navigate('/profile/edit');
      }, 1000);
    } else {
      setIsLoading(false);
      toast({
        title: "Signup failed",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  const handleThirdPartySignup = (provider: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Create a customer profile for the third-party signup
      const customerProfile = {
        id: `CUST-${Math.floor(Math.random() * 9000) + 1000}`,
        firstName: `${provider}`,
        lastName: "User",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: `${provider.toLowerCase()}@example.com`,
        rating: 5.0,
        cardDetails: {
          last4Digits: "",
          cardType: "",
          expiryMonth: 0,
          expiryYear: 0
        },
        ridesHistory: [],
        reviews: [],
        paymentMethods: []
      };
      
      // Login the customer with the created profile
      loginCustomer(customerProfile);
      
      setIsLoading(false);
      toast({
        title: "Account created",
        description: `Your account has been successfully created with ${provider}. Please complete your profile information.`
      });
      navigate('/profile/edit');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="text-black text-2xl font-bold">
            Uber
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Create a rider account</h1>
          
          <div className="space-y-4 mb-8">
            <Button
              variant="outline"
              className="w-full py-6 border-2 flex items-center justify-center gap-2"
              onClick={() => handleThirdPartySignup('Google')}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-6 border-2 flex items-center justify-center gap-2"
              onClick={() => handleThirdPartySignup('Apple')}
              disabled={isLoading}
            >
              <Apple className="h-5 w-5" />
              Continue with Apple
            </Button>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First name"
                className="py-6 px-4 border-2 rounded-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              
              <Input
                type="text"
                placeholder="Last name"
                className="py-6 px-4 border-2 rounded-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <Input
              type="email"
              placeholder="Email"
              className="w-full py-6 px-4 border-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              className="w-full py-6 px-4 border-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <p className="text-sm text-gray-600">
              By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Uber and its affiliates to the number provided.
            </p>
            
            <Button
              type="submit"
              className="w-full py-6 bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-gray-600 mt-2">
              Want to drive with Uber?{" "}
              <Link to="/driver/signup" className="text-black font-medium">
                Sign up to drive
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
