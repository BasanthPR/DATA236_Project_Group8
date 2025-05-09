
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronUp } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import CustomerProfileDetails from "@/components/CustomerProfileDetails";
// import { CustomerProfile } from "@/types/customer";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState<CustomerProfile>({
//     id: "123-45-6789",
//     firstName: "John",
//     lastName: "Doe",
//     address: "123 Main St",
//     city: "San Francisco",
//     state: "CA",
//     zipCode: "94105",
//     phoneNumber: "(555) 123-4567",
//     email: "john.doe@example.com",
//     rating: 4.74,
//     cardDetails: {
//       last4Digits: "4321",
//       cardType: "Visa",
//       expiryMonth: 12,
//       expiryYear: 2025
//     },
//     ridesHistory: [
//       {
//         id: "1",
//         date: "2024-04-23",
//         destination: "SFO Airport",
//         price: 45.00,
//         driverId: "DRV-1234"
//       },
//       {
//         id: "2",
//         date: "2024-04-22",
//         destination: "Downtown SF",
//         price: 22.50,
//         driverId: "DRV-5678"
//       },
//       {
//         id: "3",
//         date: "2024-04-20",
//         destination: "Berkeley",
//         price: 35.75,
//         driverId: "DRV-9012"
//       }
//     ],
//     reviews: [
//       {
//         id: "1",
//         rating: 5,
//         comment: "Great passenger, very punctual!",
//         date: "2024-04-23",
//         driverId: "DRV-1234"
//       },
//       {
//         id: "2",
//         rating: 4.5,
//         comment: "Pleasant ride experience",
//         date: "2024-04-22",
//         driverId: "DRV-5678"
//       },
//       {
//         id: "3",
//         rating: 5,
//         comment: "Excellent communication and very respectful",
//         date: "2024-04-20",
//         driverId: "DRV-9012"
//       }
//     ],
//     paymentMethods: [
//       {
//         id: "pm_1",
//         type: "Visa",
//         name: "Personal Card",
//         isDefault: true,
//         last4Digits: "4321"
//       },
//       {
//         id: "pm_2",
//         type: "Mastercard",
//         name: "Work Card",
//         isDefault: false,
//         last4Digits: "8765"
//       }
//     ]
//   });

//   // Check if there's stored user data in localStorage
//   useEffect(() => {
//     const storedUserData = localStorage.getItem('userData');
//     if (storedUserData) {
//       try {
//         const userData = JSON.parse(storedUserData);
//         // Merge the stored user data with the default profile data
//         setProfile(prevProfile => ({
//           ...prevProfile,
//           firstName: userData.firstName || prevProfile.firstName,
//           lastName: userData.lastName || prevProfile.lastName,
//           email: userData.email || prevProfile.email,
//           // Add other fields as needed
//         }));
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//       }
//     }
//   }, []);

//   const handleClose = () => {
//     navigate(-1);
//   };

//   // Here we'll update the Manage Account functionality to route to the settings page
//   // instead of signing out the user
//   const handleManageAccount = () => {
//     navigate("/account/settings");
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem('username');
//     localStorage.removeItem('userData');
//     localStorage.removeItem('isLoggedIn');
    
//     toast({
//       title: "Signed out successfully",
//       description: "You have been signed out of your account."
//     });
//     navigate('/');
//   };

//   return (
//     <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//       <div className="max-w-3xl mx-auto p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold">{`${profile.firstName} ${profile.lastName}`}</h1>
//           <button className="p-2" onClick={handleClose}>
//             <ChevronUp className="h-6 w-6" />
//           </button>
//         </div>

//         <CustomerProfileDetails profile={profile} />

//         <div className="mt-8 space-y-4">
//           <Button
//             variant="outline"
//             className="w-full py-4 text-xl"
//             onClick={handleManageAccount}
//           >
//             Manage Account
//           </Button>
          
//           <Button
//             variant="outline"
//             className="w-full py-4 text-xl text-red-600 hover:text-red-700"
//             onClick={handleSignOut}
//           >
//             Sign out
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
//-----------------------------------------------------------------------------------------------------------

// //src/pages/ProfilePage.tsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronUp, Edit2, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import CustomerForm from "@/components/CustomerForm";
// import { CustomerProfile } from "@/types/customer";
// import { customerService } from "@/services/customerService";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState<Partial<CustomerProfile>>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     rating: 0,
//     ridesHistory: [],
//     reviews: []
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // Fetch customer profile on component mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const data = await customerService.getCustomerProfile();
//         console.log("API Response:", data);
        
//         setProfile(data);
        
//         // If this is a new auto-created profile, show a friendly message
//         if (data.isNewProfile) {
//           console.log("New auto-created profile detected");
//           setError("Your profile has been initialized with your signup information. You can complete additional details now.");
          
//           // Only auto-open edit form if basic info is missing
//           if (!data.address || !data.phoneNumber) {
//             setIsEditing(true);
//           }
//         } else {
//           setError(null);
//         }
        
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//         setError("Failed to load profile data. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleSubmit = async (formData: Partial<CustomerProfile>) => {
//     try {
//       setIsLoading(true);
      
//       // Update existing profile (even if auto-created)
//       console.log("Updating profile");
//       const { email, ...updateData } = formData;
//       const updatedProfile = await customerService.updateCustomerProfile(updateData);
      
//       toast({
//         title: "Profile Updated",
//         description: "Your profile has been successfully updated.",
//       });
      
//       setProfile(updatedProfile);
//       setIsEditing(false);
//       setError(null);
//     } catch (err) {
//       console.error("Error saving profile:", err);
//       toast({
//         title: "Error",
//         description: "Failed to save profile. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     navigate(-1);
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userData');
//     localStorage.removeItem('isLoggedIn');
    
//     toast({
//       title: "Signed out successfully",
//       description: "You have been signed out of your account."
//     });
//     navigate('/');
//   };

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
//         <div className="text-center">
//           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//       <div className="max-w-3xl mx-auto p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold">
//             {profile?.firstName && profile?.lastName
//               ? `${profile.firstName} ${profile.lastName}`
//               : "My Profile"}
//           </h1>
//           <button className="p-2" onClick={handleClose}>
//             <ChevronUp className="h-6 w-6" />
//           </button>
//         </div>

//         {error && (
//           <div className={`border px-4 py-3 rounded mb-6 ${
//             error.includes("initialized") || error.includes("complete") 
//               ? "bg-blue-100 border-blue-400 text-blue-700" 
//               : "bg-red-100 border-red-400 text-red-700"
//           }`}>
//             {error}
//           </div>
//         )}

//         <Tabs defaultValue="details" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-8">
//             <TabsTrigger value="details">Profile Details</TabsTrigger>
//             <TabsTrigger value="activity">Activity & Rides</TabsTrigger>
//           </TabsList>

//           <TabsContent value="details">
//             <Card>
//               <CardHeader className="pb-4 flex flex-row items-center justify-between">
//                 <CardTitle>Personal Information</CardTitle>
//                 {!isEditing && (
//                   <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
//                     <Edit2 className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 )}
//               </CardHeader>
//               <CardContent>
//                 {isEditing ? (
//                   <CustomerForm
//                     initialData={profile}
//                     onSubmit={handleSubmit}
//                     onCancel={() => setIsEditing(false)}
//                   />
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm text-gray-500">Customer ID</p>
//                       <p className="font-medium">{profile?.customerId || "-"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Full Name</p>
//                       <p className="font-medium">
//                         {profile?.firstName && profile?.lastName
//                           ? `${profile.firstName} ${profile.lastName}`
//                           : "-"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Email</p>
//                       <p className="font-medium">{profile?.email || "-"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Phone</p>
//                       <p className="font-medium">{profile?.phoneNumber || "-"}</p>
//                     </div>
//                     <div className="md:col-span-2">
//                       <p className="text-sm text-gray-500">Address</p>
//                       <p className="font-medium">
//                         {profile?.address
//                           ? `${profile.address}, ${profile.city || ""}, ${profile.state || ""} ${profile.zipCode || ""}`
//                           : "-"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Customer Rating</p>
//                       <p className="font-medium flex items-center">
//                         {profile?.rating ? profile.rating.toFixed(2) : "-"}
//                         {profile?.rating && <span className="text-yellow-500 ml-1">★</span>}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="activity">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Rides</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {(profile?.ridesHistory && profile.ridesHistory.length > 0) ? (
//                   <div className="space-y-4">
//                     {profile.ridesHistory.map((ride, index) => (
//                       <div
//                         key={ride.id || index}
//                         className="border rounded-lg p-4 flex justify-between items-center"
//                       >
//                         <div>
//                           <p className="font-medium">{ride.destination}</p>
//                           <p className="text-sm text-gray-500">{ride.date}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">${ride.price.toFixed(2)}</p>
//                           <p className="text-sm text-gray-500">Driver ID: {ride.driverId}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
//                     <p className="text-gray-500">No ride history available</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="mt-8 space-y-4">
//           <Button
//             variant="outline"
//             className="w-full py-4 text-xl text-red-600 hover:text-red-700"
//             onClick={handleSignOut}
//           >
//             Sign out
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
//----------------------------------------------------------------------------------------------------------------------------


// src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Edit2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerForm from "@/components/CustomerForm";
import { CustomerProfile } from "@/types/customer";
import { customerService } from "@/services/customerService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<CustomerProfile>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rating: 0,
    ridesHistory: [],
    reviews: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch customer profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await customerService.getCustomerProfile();
        console.log("API Response:", data);
        
        // Ensure ridesHistory exists to prevent errors
        setProfile({
          ...data,
          ridesHistory: data.ridesHistory || []
        });
        
        // If this is a new auto-created profile, show a friendly message
        if (data.isNewProfile) {
          console.log("New auto-created profile detected");
          setError("Your profile has been initialized with your signup information. You can complete additional details now.");
          
          // Only auto-open edit form if basic info is missing
          if (!data.address || !data.phoneNumber) {
            setIsEditing(true);
          }
        } else {
          setError(null);
        }
        
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data. Please try again later.");
        
        // Get user info from localStorage if available
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData.email) {
            setProfile(prev => ({
              ...prev,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || ''
            }));
          }
        } catch (e) {
          console.error("Error parsing userData from localStorage:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (formData: Partial<CustomerProfile>) => {
    try {
      setIsLoading(true);
      
      console.log("Updating profile with data:", formData);
      
      // Remove email from update data
      const { email, ...updateData } = formData;
      const updatedProfile = await customerService.updateCustomerProfile(updateData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {profile?.firstName && profile?.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : "My Profile"}
          </h1>
          <button className="p-2" onClick={handleClose}>
            <ChevronUp className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className={`border px-4 py-3 rounded mb-6 ${
            error.includes("initialized") || error.includes("complete") 
              ? "bg-blue-100 border-blue-400 text-blue-700" 
              : "bg-red-100 border-red-400 text-red-700"
          }`}>
            {error}
          </div>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="activity">Activity & Rides</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <CustomerForm
                    initialData={profile}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Customer ID</p>
                      <p className="font-medium">{profile?.customerId || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {profile?.firstName && profile?.lastName
                          ? `${profile.firstName} ${profile.lastName}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phoneNumber || "-"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {profile?.address
                          ? `${profile.address}, ${profile.city || ""}, ${profile.state || ""} ${profile.zipCode || ""}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Rating</p>
                      <p className="font-medium flex items-center">
                        {profile?.rating ? profile.rating.toFixed(2) : "-"}
                        {profile?.rating && <span className="text-yellow-500 ml-1">★</span>}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Rides</CardTitle>
              </CardHeader>
              <CardContent>
                {(profile?.ridesHistory && profile.ridesHistory.length > 0) ? (
                  <div className="space-y-4">
                    {profile.ridesHistory.map((ride, index) => (
                      <div
                        key={ride.id || `ride-${index}`}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{ride.destination || ride.to || "Destination"}</p>
                          <p className="text-sm text-gray-500">{ride.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(ride.price || ride.fare || 0).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Driver ID: {ride.driverId || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No ride history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-4">
          <Button
            variant="outline"
            className="w-full py-4 text-xl text-red-600 hover:text-red-700"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;