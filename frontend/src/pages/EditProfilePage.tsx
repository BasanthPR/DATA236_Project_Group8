
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters." }),
  cardType: z.string().optional(),
  last4Digits: z.string().optional(),
  expiryMonth: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 12), {
      message: "Expiry month must be between 1-12."
    })
    .optional(),
  expiryYear: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 2023), {
      message: "Expiry year must be valid."
    })
    .optional(),
});

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { customerProfile, updateCustomerProfile, isCustomerLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to edit your profile",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isCustomerLoggedIn, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customerProfile?.firstName || "",
      lastName: customerProfile?.lastName || "",
      email: customerProfile?.email || "",
      phoneNumber: customerProfile?.phoneNumber || "",
      address: customerProfile?.address || "",
      city: customerProfile?.city || "",
      state: customerProfile?.state || "",
      zipCode: customerProfile?.zipCode || "",
      cardType: customerProfile?.cardDetails?.cardType || "",
      last4Digits: customerProfile?.cardDetails?.last4Digits || "",
      expiryMonth: customerProfile?.cardDetails?.expiryMonth?.toString() || "",
      expiryYear: customerProfile?.cardDetails?.expiryYear?.toString() || "",
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!customerProfile) return;
    
    setIsLoading(true);
    
    try {
      const updatedProfile = {
        ...customerProfile,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        cardDetails: {
          ...customerProfile.cardDetails,
          cardType: values.cardType || customerProfile.cardDetails.cardType,
          last4Digits: values.last4Digits || customerProfile.cardDetails.last4Digits,
          expiryMonth: values.expiryMonth ? parseInt(values.expiryMonth) : customerProfile.cardDetails.expiryMonth,
          expiryYear: values.expiryYear ? parseInt(values.expiryYear) : customerProfile.cardDetails.expiryYear,
        }
      };
      
      updateCustomerProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!customerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 p-4 bg-background z-10 border-b">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Edit Profile</h1>
        </div>
      </div>
      
      <div className="flex-1 container max-w-md mx-auto pt-20 pb-10 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Address</h2>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Visa, Mastercard, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last4Digits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last 4 Digits</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Month</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="YYYY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-4 text-lg mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
