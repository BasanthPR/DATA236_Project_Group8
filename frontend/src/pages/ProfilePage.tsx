
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import CustomerProfileDetails from "@/components/CustomerProfileDetails";
import { useUser } from "@/contexts/UserContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { customerProfile, isCustomerLoggedIn, logoutCustomer } = useUser();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isCustomerLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to view your profile",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isCustomerLoggedIn, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleManageAccount = () => {
    navigate("/profile/edit");
  };

  const handleSignOut = () => {
    logoutCustomer();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account."
    });
    navigate('/');
  };

  if (!customerProfile) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{`${customerProfile.firstName} ${customerProfile.lastName}`}</h1>
          <button className="p-2" onClick={handleClose}>
            <ChevronUp className="h-6 w-6" />
          </button>
        </div>

        <CustomerProfileDetails profile={customerProfile} />

        <div className="mt-8 space-y-4">
          <Button
            variant="outline"
            className="w-full py-4 text-xl flex items-center justify-center gap-2"
            onClick={handleManageAccount}
          >
            <Edit className="h-5 w-5" />
            Edit Profile
          </Button>
          
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
