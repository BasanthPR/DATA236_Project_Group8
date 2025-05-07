
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Apple, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    // ✅ Frontend field validation
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4001/api/auth/signup/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", `${data.user.firstName} ${data.user.lastName}`);
        toast({
          title: "Account created",
          description: "Your account has been successfully created."
        });
        navigate("/");
      } else {
        toast({
          title: "Signup failed",
          description: data.message || "Something went wrong",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleThirdPartySignup = (provider: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Using a generic username based on the provider
      const username = `${provider}User`;
      localStorage.setItem('username', username);
      
      toast({
        title: "Account created",
        description: `Your account has been successfully created with ${provider}.`
      });
      navigate('/');
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
          <h1 className="text-3xl font-bold mb-6">Create your account</h1>
          
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/components/ui/use-toast";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     customer_id: "",
//     first_name: "",
//     last_name: "",
//     address: "",
//     city: "",
//     state: "",
//     zip_code: "",
//     phone_number: "",
//     email: "",
//     card_type: "",
//     last_4_digits: "",
//     expiry_month: "",
//     expiry_year: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const {
//       customer_id,
//       first_name,
//       last_name,
//       address,
//       city,
//       state,
//       zip_code,
//       phone_number,
//       email,
//       card_type,
//       last_4_digits,
//       expiry_month,
//       expiry_year,
//       password,
//     } = formData;

//     if (
//       !customer_id ||
//       !first_name ||
//       !last_name ||
//       !address ||
//       !city ||
//       !state ||
//       !zip_code ||
//       !phone_number ||
//       !email ||
//       !card_type ||
//       !last_4_digits ||
//       !expiry_month ||
//       !expiry_year ||
//       !password
//     ) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^\d{10}$/.test(phone_number)) {
//       toast({
//         title: "Invalid phone number",
//         description: "Phone number must be 10 digits.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^\d{5}$/.test(zip_code)) {
//       toast({
//         title: "Invalid ZIP code",
//         description: "ZIP code must be 5 digits.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       toast({
//         title: "Invalid email",
//         description: "Please enter a valid email address.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^\d{4}$/.test(last_4_digits)) {
//       toast({
//         title: "Invalid Card Details",
//         description: "Last 4 digits must be exactly 4 numbers.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^(0[1-9]|1[0-2])$/.test(expiry_month)) {
//       toast({
//         title: "Invalid Expiry Month",
//         description: "Expiry month must be between 01 and 12.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!/^\d{4}$/.test(expiry_year)) {
//       toast({
//         title: "Invalid Expiry Year",
//         description: "Expiry year must be a 4-digit number.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (password.length < 6) {
//       toast({
//         title: "Weak password",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!validateForm()) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast({
//           title: "Account created",
//           description: "Your account has been successfully created.",
//         });
//         navigate("/");
//       } else {
//         toast({
//           title: "Signup failed",
//           description: data.message || "Something went wrong",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Signup failed",
//         description: "Network error. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <header className="border-b border-gray-200 py-4">
//         <div className="container mx-auto px-4">
//           <Link to="/" className="text-black text-2xl font-bold">
//             Uber
//           </Link>
//         </div>
//       </header>

//       <main className="flex-1 flex items-center justify-center py-12 px-4">
//         <div className="w-full max-w-md">
//           <h1 className="text-3xl font-bold mb-6">Create your account</h1>

//           <form onSubmit={handleSignup} className="space-y-4">
//             <Input
//               name="customer_id"
//               placeholder="Customer ID"
//               value={formData.customer_id}
//               onChange={handleChange}
//             />
//             <Input
//               name="first_name"
//               placeholder="First Name"
//               value={formData.first_name}
//               onChange={handleChange}
//             />
//             <Input
//               name="last_name"
//               placeholder="Last Name"
//               value={formData.last_name}
//               onChange={handleChange}
//             />
//             <Input
//               name="address"
//               placeholder="Address"
//               value={formData.address}
//               onChange={handleChange}
//             />
//             <Input
//               name="city"
//               placeholder="City"
//               value={formData.city}
//               onChange={handleChange}
//             />
//             <Input
//               name="state"
//               placeholder="State"
//               value={formData.state}
//               onChange={handleChange}
//             />
//             <Input
//               name="zip_code"
//               placeholder="ZIP Code"
//               value={formData.zip_code}
//               onChange={handleChange}
//             />
//             <Input
//               name="phone_number"
//               placeholder="Phone Number"
//               value={formData.phone_number}
//               onChange={handleChange}
//             />
//             <Input
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//             />

//             <h2 className="text-xl font-bold mt-6">Credit Card</h2>
//             <Input
//               name="card_type"
//               placeholder="Card Type (e.g., Visa, MasterCard)"
//               value={formData.card_type}
//               onChange={handleChange}
//             />
//             <div className="flex gap-4">
//               <Input
//                 name="last_4_digits"
//                 placeholder="Last 4 Digits"
//                 value={formData.last_4_digits}
//                 onChange={handleChange}
//                 className="flex-1"
//               />
//               <Input
//                 name="expiry_month"
//                 placeholder="Expiry Month (MM)"
//                 value={formData.expiry_month}
//                 onChange={handleChange}
//                 className="flex-1"
//               />
//               <Input
//                 name="expiry_year"
//                 placeholder="Expiry Year (YYYY)"
//                 value={formData.expiry_year}
//                 onChange={handleChange}
//                 className="flex-1"
//               />
//             </div>

//             <Input
//               name="password"
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Creating Account..." : "Sign Up"}
//             </Button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SignupPage;